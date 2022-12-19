using System.Net;
using System.Text.Json;
using Application.Core;

namespace API.Middleware
{
    public class ExceptionMiddleware
    {
            private readonly RequestDelegate _next;
            private readonly ILogger<ExceptionMiddleware> _logger;
            private readonly IHostEnvironment _env;
        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger, IHostEnvironment env)
        {
                  _env = env;
                  _logger = logger;
                  _next = next;
            
        }
        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ex.Message);
                context.Response.ContentType = "application/json";
                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

                // Simple turnary operator for checking if we are in deve mode and changing the error message acordingly
                var response = _env.IsDevelopment()
                    ? new AppException(context.Response.StatusCode, ex.Message, ex.StackTrace?.ToString())
                    : new AppException(context.Response.StatusCode, "Internal Server Error");

                // Formatting the Json object ourselves and putting it in an options object. 
                var options = new JsonSerializerOptions{PropertyNamingPolicy = JsonNamingPolicy.CamelCase};

                // Grabbing the json object now from JsonSerializer
                var json = JsonSerializer.Serialize(response, options);
                
                // Sending it back as our response:
                await context.Response.WriteAsync(json);
            }
        }
    }
}