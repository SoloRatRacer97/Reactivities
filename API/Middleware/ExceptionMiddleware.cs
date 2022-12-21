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
        // Middleware needs to have InvokeAsync? Our application will look for middleware called this. 
        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                // Default is trying to pass this on. If there is nothing to catch as an exception, go ahead and pass it right on by. Simple. 
                await _next(context);
            }
            catch (Exception ex)
            {
                // First we need to log the error and pass in the exception and the exception message
                _logger.LogError(ex, ex.Message);
                // Not sure what this is.... Sets up the response as json?
                context.Response.ContentType = "application/json";
                // Setting the error code to 500 for the server error. 
                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

                // Simple turnary operator for checking if we are in dev mode and changing the error message acordingly
                var response = _env.IsDevelopment()
                    // If we are in development send it as a message and stringify the message
                    ? new AppException(context.Response.StatusCode, ex.Message, ex.StackTrace?.ToString())
                    // If not, just make it a general server error.
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