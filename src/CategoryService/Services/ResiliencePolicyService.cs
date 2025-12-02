using Polly;
using Polly.Timeout;
using Polly.Wrap;

namespace CategoryService.Services
{
    public interface IResiliencePolicyService
    {
        AsyncPolicyWrap<T> GetPolicy<T>();
        AsyncPolicy GetPolicy();
    }

    public class ResiliencePolicyService : IResiliencePolicyService
    {
        private readonly ILogger<ResiliencePolicyService> _logger;
        private readonly AsyncPolicy _retryPolicy;
        private readonly AsyncPolicy _circuitBreakerPolicy;
        private readonly AsyncPolicy _timeoutPolicy;

        public ResiliencePolicyService(ILogger<ResiliencePolicyService> logger)
        {
            _logger = logger;

            // 1. Retry policy - vnútorná vrstva
            _retryPolicy = Policy
                .Handle<TimeoutException>()
                .Or<TimeoutRejectedException>()
                .Or<TaskCanceledException>()
                .Or<InvalidOperationException>() // RabbitMQ connection issues
                .WaitAndRetryAsync(
                    retryCount: 3,
                    sleepDurationProvider: retryAttempt => TimeSpan.FromSeconds(Math.Pow(2, retryAttempt)),
                    onRetry: (exception, timeSpan, retryCount, context) =>
                    {
                        _logger.LogWarning(exception,
                            "Retry {RetryCount} after {TimeSpan} seconds for external service call",
                            retryCount, timeSpan.TotalSeconds);
                    });

            // 2. Circuit breaker - stredná vrstva
            _circuitBreakerPolicy = Policy
                .Handle<TimeoutException>()
                .Or<TimeoutRejectedException>()
                .Or<InvalidOperationException>()
                .CircuitBreakerAsync(
                    exceptionsAllowedBeforeBreaking: 5,
                    durationOfBreak: TimeSpan.FromSeconds(30),
                    onBreak: (exception, breakDelay) =>
                    {
                        _logger.LogError(exception,
                            "Circuit broken for {BreakDelay} seconds - external service unavailable",
                            breakDelay.TotalSeconds);
                    },
                    onReset: () =>
                    {
                        _logger.LogInformation("Circuit reset - external service is healthy again");
                    },
                    onHalfOpen: () =>
                    {
                        _logger.LogInformation("Circuit half-open - testing if external service recovered");
                    });

            // 3. Timeout policy - vonkajšia vrstva (pred circuit breaker)
            _timeoutPolicy = Policy
                .TimeoutAsync(
                    TimeSpan.FromSeconds(10),
                    TimeoutStrategy.Pessimistic,
                    onTimeoutAsync: (context, timeSpan, task) =>
                    {
                        _logger.LogWarning(
                            "Timeout after {TimeSpan} seconds for external service call",
                            timeSpan.TotalSeconds);
                        return Task.CompletedTask;
                    });
        }

        // Pre typované polícy (napr. CategoryResponse, AuthorResponse)
        public AsyncPolicyWrap<T> GetPolicy<T>()
        {
            var fallbackPolicy = Policy<T>
                .Handle<Exception>()
                .FallbackAsync(
                    fallbackValue: default(T),
                    onFallbackAsync: (result, context) =>
                    {
                        _logger.LogWarning(result.Exception,
                            "Fallback triggered for external service call");
                        return Task.CompletedTask;
                    });

            // Správne poradie (od vonku dovnútra): Fallback -> Timeout -> Circuit Breaker -> Retry
            return Policy.WrapAsync(
                fallbackPolicy,
                _timeoutPolicy.AsAsyncPolicy<T>(),
                _circuitBreakerPolicy.AsAsyncPolicy<T>(),
                _retryPolicy.AsAsyncPolicy<T>());
        }

        // Pre netypované polícy (databázové operácie)
        public AsyncPolicy GetPolicy()
        {
            // Bez fallback - nech exceptiony prebublajú pre DB operácie
            return Policy.WrapAsync(_timeoutPolicy, _circuitBreakerPolicy, _retryPolicy);
        }
    }
}