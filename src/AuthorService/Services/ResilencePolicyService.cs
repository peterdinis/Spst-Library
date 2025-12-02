using Polly;
using Polly.Timeout;
using Polly.Wrap;

namespace AuthorService.Services
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
                .Handle<HttpRequestException>()
                .Or<TimeoutRejectedException>()
                .Or<TaskCanceledException>()
                .WaitAndRetryAsync(
                    retryCount: 3,
                    sleepDurationProvider: retryAttempt => TimeSpan.FromSeconds(Math.Pow(2, retryAttempt)),
                    onRetry: (exception, timeSpan, retryCount, context) =>
                    {
                        _logger.LogWarning(exception,
                            "Retry {RetryCount} after {TimeSpan} seconds",
                            retryCount, timeSpan.TotalSeconds);
                    });

            // 2. Circuit breaker - stredná vrstva
            _circuitBreakerPolicy = Policy
                .Handle<HttpRequestException>()
                .Or<TimeoutRejectedException>()
                .CircuitBreakerAsync(
                    exceptionsAllowedBeforeBreaking: 5,
                    durationOfBreak: TimeSpan.FromSeconds(30),
                    onBreak: (exception, breakDelay) =>
                    {
                        _logger.LogError(exception,
                            "Circuit broken for {BreakDelay} seconds", breakDelay.TotalSeconds);
                    },
                    onReset: () =>
                    {
                        _logger.LogInformation("Circuit reset - service is healthy again");
                    },
                    onHalfOpen: () =>
                    {
                        _logger.LogInformation("Circuit half-open - testing if service recovered");
                    });

            // 3. Timeout policy - vonkajšia vrstva (pred circuit breaker)
            _timeoutPolicy = Policy
                .TimeoutAsync(
                    TimeSpan.FromSeconds(10),
                    TimeoutStrategy.Pessimistic,
                    onTimeoutAsync: (context, timeSpan, task) =>
                    {
                        _logger.LogWarning("Timeout after {TimeSpan} seconds", timeSpan.TotalSeconds);
                        return Task.CompletedTask;
                    });
        }

        // Pre typované polícy (napr. List<AuthorBookDto>)
        public AsyncPolicyWrap<T> GetPolicy<T>()
        {
            var fallbackPolicy = Policy<T>
                .Handle<Exception>()
                .FallbackAsync(
                    fallbackValue: default(T),
                    onFallbackAsync: (result, context) =>
                    {
                        _logger.LogWarning(result.Exception, "Fallback triggered");
                        return Task.CompletedTask;
                    });

            // Správne poradie (od vonku dovnútra): Fallback -> Timeout -> Circuit Breaker -> Retry
            return Policy.WrapAsync(
                fallbackPolicy,
                _timeoutPolicy.AsAsyncPolicy<T>(),
                _circuitBreakerPolicy.AsAsyncPolicy<T>(),
                _retryPolicy.AsAsyncPolicy<T>());
        }

        // Pre netypované polícy
        public AsyncPolicy GetPolicy()
        {
            // Bez fallback - nech exceptiony prebublajú
            return Policy.WrapAsync(_timeoutPolicy, _circuitBreakerPolicy, _retryPolicy);
        }
    }
}