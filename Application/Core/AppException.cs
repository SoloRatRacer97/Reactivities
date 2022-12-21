using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Core
{
    // This is setting up an exception class so we can see what the api is throwing as an exception when we are in development mode. I think this is for if we have a server error.
    public class AppException
    {
        public AppException(int statusCode, string message, string details = null)
        {
                StatusCode = statusCode;
                Message = message;
                Details = details;
        }

        public int StatusCode { get; set; }
        public string Message { get; set; }
        public string Details { get; set; }
    }
}