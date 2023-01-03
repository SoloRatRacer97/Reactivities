using Application.Activities;
using Application.Core;
using Application.Interfaces;
using FluentValidation;
using FluentValidation.AspNetCore;
using Infrastructure.Photos;
using Infrastructure.Security;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Extensions
{
      // *Ensure this is static*
      public static class ApplicationServiceExtensions
      {
            public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration config)
            {
                  // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
                  services.AddEndpointsApiExplorer();
                  services.AddSwaggerGen();
                  services.AddDbContext<DataContext>(opt =>
                  {
                        opt.UseSqlite(config.GetConnectionString("DefaultConnection"));
                  });

                  // This is CORS (Coross Origin Resource Sharing).
                  // We need this because our API is set up on lcoalhost 5000 and our frontent is listening on local host 3000. So, we need to create a Cors policy here to allow this cross domain sharing. This is later implimented below, before authorization.
                  services.AddCors(opt =>
                  {
                        opt.AddPolicy("CorsPolicy", policy =>
                  {
                        policy.AllowAnyMethod().AllowAnyHeader().WithOrigins("http://localhost:3000");
                  });
                  });

                  services.AddMediatR(typeof(List.Handler));
                  services.AddAutoMapper(typeof(MappingProfiles).Assembly);
                  // Adding in fluent validation to the application:
                  services.AddFluentValidationAutoValidation();
                  // Setting the validators to use the Create class to validate aginst
                  services.AddValidatorsFromAssemblyContaining<Create>();
                  // Adding two services for our infrastrucure project. 
                  services.AddHttpContextAccessor();
                  services.AddScoped<IUserAccessor, UserAccessor>();
                  // Adding the interface for the photo accessor
                  services.AddScoped<IPhotoAccessor, PhotoAccessor>();
                  // Adding services for Cloudinary
                  services.Configure<CloudinarySettings>(config.GetSection("Cloudinary"));
                  services.AddSignalR();

                  return services;
            }
      }
}