using API.Extensions;
using API.Middleware;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.EntityFrameworkCore;
using Persistence;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers(opt => 
{
      var policy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
      opt.Filters.Add(new AuthorizeFilter(policy));
});
builder.Services.AddApplicationServices(builder.Configuration);
builder.Services.AddIdentityServices(builder.Configuration);

var app = builder.Build();

// Configuring the middleware to catch any of our esceptions and 
app.UseMiddleware<ExceptionMiddleware>();

if (app.Environment.IsDevelopment())
{
      app.UseSwagger();
      app.UseSwaggerUI();
}

// Note that we need to use CORS before authorization. 
app.UseCors("CorsPolicy");

// First we authenticate:
app.UseAuthentication();
// Then we authorize:
app.UseAuthorization();

app.MapControllers();

// The 'using' word here essentailly trashes everything in the function after we are done using it. There is a garbage collector in .Net but we cannot controll when it runs and we want to clean things up manualy and endure we have control over when this gets taken out of memory. 

// Basically, we only need the CreateScope for creating the database, then never again. Its a single use function for setting up the database and thats it. 
using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;

try
{
      // Regular data for migration and seeding:
      var context = services.GetRequiredService<DataContext>();
      // Password and user data for migration seeding:
      var userManager = services.GetRequiredService<UserManager<AppUser>>();
      await context.Database.MigrateAsync();
      await Seed.SeedData(context, userManager);
}
catch (Exception ex)
{
      var logger = services.GetRequiredService<ILogger<Program>>();
      logger.LogError(ex, "An error occured during migration");
}

app.Run();
