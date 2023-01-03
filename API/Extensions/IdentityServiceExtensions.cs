// Need to do some homework on this one to understand it better:

using System.Text;
using API.Services;
using Domain;
using Infrastructure.Security;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;
using Persistence;

namespace API.Extensions
{
    public static class IdentityServiceExtensions
    {
        public static IServiceCollection AddIdentityServices(this IServiceCollection services, IConfiguration config )
        {
            // This identity Core does not add redirection which prevents us from running into problems later on
            services.AddIdentityCore<AppUser>(opt => 
            {
                // This configures the rules for the password
                opt.Password.RequireNonAlphanumeric = false;
                opt.User.RequireUniqueEmail = true;
            })
            // This allows us to query our users in our store, or database
            .AddEntityFrameworkStores<DataContext>();

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["TokenKey"]));

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(opt => 
            {
                opt.TokenValidationParameters = new TokenValidationParameters
                {
                    // Esnures the token is valid
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = key,
                    // Not validating aginst:
                    ValidateIssuer = false,
                    // Not validating aginst:
                    ValidateAudience = false
                };
                // Something to do with the chat elelment that was in sect 19:
                opt.Events = new JwtBearerEvents
                {
                    OnMessageReceived = context => 
                    {
                        var accessToken = context.Request.Query["access_token"];
                        var path = context.HttpContext.Request.Path;
                        if (!string.IsNullOrEmpty(accessToken) && (path.StartsWithSegments("/chat")))
                        {
                            context.Token = accessToken;
                        }
                        return Task.CompletedTask;
                    }
                };

            });

            // Configuring the isHostRequirement into identity:
            services.AddAuthorization(opt => 
            {
                opt.AddPolicy("IsActivityHost", policy => 
                {
                    policy.Requirements.Add(new IsHostRequirement());
                });
            });

            // A refference for after things are completed?:
            services.AddTransient<IAuthorizationHandler, IsHostRequirementHandler>();

            // This token service is scopped to the HTTP request. Need more info on this.....
            services.AddScoped<TokenService>();

            return services;
        }
    }
}