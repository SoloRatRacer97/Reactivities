using System.Security.Claims;
using Application.Interfaces;
using Microsoft.AspNetCore.Http;

namespace Infrastructure.Security
{
      public class UserAccessor : IUserAccessor
      {
        private readonly IHttpContextAccessor _httpContextAccessor;
        // Here we are accessing the HTTP context. However, we are doing it this way since we do not have firect access to the data context since we are in different projects
        public UserAccessor(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }
            public string GetUsername()
            {
                // Grabbing the name from context now:
                return _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);
            }
      }
}