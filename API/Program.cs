using API.Extensions;
using API.Middleware;
using Microsoft.EntityFrameworkCore;
using Persistence;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddApplicationServices(builder.Configuration);

var app = builder.Build();

// Configure the HTTP request pipeline.

app.UseMiddleware<ExceptionMiddleware>();

if (app.Environment.IsDevelopment())
{
      app.UseSwagger();
      app.UseSwaggerUI();
}

// Note that we need to use CORS bbefore authorization. 
app.UseCors("CorsPolicy");

app.UseAuthorization();

app.MapControllers();

// The 'using' word here essentailly trashes everything in the function after we are done using it. There is a garbage collector in .Net but we cannot controll when it runs and we want to clean things up manualy and endure we have control over when this gets taken out of memory. 

// Basically, we only need the CreateScope for creating the database, then never again. Its a single use function for setting up the database and thats it. 
using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;

try
{
      var context = services.GetRequiredService<DataContext>();
      await context.Database.MigrateAsync();
      await Seed.SeedData(context);
}
catch (Exception ex)
{
      var logger = services.GetRequiredService<ILogger<Program>>();
      logger.LogError(ex, "An error occured during migration");
}

app.Run();
