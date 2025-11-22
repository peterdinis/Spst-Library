using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System.Text;
using Newtonsoft.Json;
using BooksService.Messages;

namespace BooksService.Services
{
    public interface IRabbitMQService
    {
        Task<bool> CheckCategoryExists(int categoryId);
        void Dispose();
    }

    public class RabbitMQService : IRabbitMQService
    {
        private readonly IConnection _connection;
        private readonly IModel _channel;
        private readonly string _requestQueueName = "category_exists_requests";
        private readonly string _responseQueueName;
        private readonly Dictionary<string, TaskCompletionSource<CategoryExistsResponse>> _pendingRequests;
        private readonly ILogger<RabbitMQService> _logger;

        public RabbitMQService(ILogger<RabbitMQService> logger)
        {
            _logger = logger;
            _pendingRequests = new Dictionary<string, TaskCompletionSource<CategoryExistsResponse>>();

            var factory = new ConnectionFactory()
            {
                HostName = "localhost", // alebo konfigurovateľné
                UserName = "guest",
                Password = "guest",
                Port = 5672
            };

            _connection = factory.CreateConnection();
            _channel = _connection.CreateModel();

            // Deklarovať request queue
            _channel.QueueDeclare(queue: _requestQueueName,
                                durable: false,
                                exclusive: false,
                                autoDelete: false,
                                arguments: null);

            // Vytvoriť temporary response queue
            _responseQueueName = _channel.QueueDeclare().QueueName;

            // Nastaviť consumer pre responses
            var consumer = new EventingBasicConsumer(_channel);
            consumer.Received += OnResponseReceived;
            _channel.BasicConsume(queue: _responseQueueName,
                                autoAck: true,
                                consumer: consumer);

            _logger.LogInformation("RabbitMQ Service initialized");
        }

        public async Task<bool> CheckCategoryExists(int categoryId)
        {
            var request = new CategoryExistsRequest
            {
                CategoryId = categoryId
            };

            var response = await SendRequestAsync(request);
            return response?.Exists ?? false;
        }

        private async Task<CategoryExistsResponse> SendRequestAsync(CategoryExistsRequest request)
        {
            var tcs = new TaskCompletionSource<CategoryExistsResponse>();
            _pendingRequests[request.RequestId] = tcs;

            var message = JsonConvert.SerializeObject(request);
            var body = Encoding.UTF8.GetBytes(message);

            var properties = _channel.CreateBasicProperties();
            properties.ReplyTo = _responseQueueName;
            properties.CorrelationId = request.RequestId;

            _channel.BasicPublish(exchange: "",
                                routingKey: _requestQueueName,
                                basicProperties: properties,
                                body: body);

            _logger.LogInformation($"Sent category check request for ID: {request.CategoryId}");

            // Timeout po 30 sekundách
            var timeoutTask = Task.Delay(TimeSpan.FromSeconds(30));
            var completedTask = await Task.WhenAny(tcs.Task, timeoutTask);

            if (completedTask == timeoutTask)
            {
                _pendingRequests.Remove(request.RequestId);
                throw new TimeoutException("Category service response timeout");
            }

            return await tcs.Task;
        }

        private void OnResponseReceived(object sender, BasicDeliverEventArgs ea)
        {
            var body = ea.Body.ToArray();
            var message = Encoding.UTF8.GetString(body);
            
            try
            {
                var response = JsonConvert.DeserializeObject<CategoryExistsResponse>(message);
                
                if (response != null && _pendingRequests.TryGetValue(response.RequestId, out var tcs))
                {
                    _pendingRequests.Remove(response.RequestId);
                    tcs.SetResult(response);
                    _logger.LogInformation($"Received category check response for ID: {response.RequestId}");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing category response");
            }
        }

        public void Dispose()
        {
            _channel?.Close();
            _connection?.Close();
            _channel?.Dispose();
            _connection?.Dispose();
        }
    }
}