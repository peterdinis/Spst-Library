using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Yarp.ReverseProxy.Configuration;

var builder = WebApplication.CreateBuilder(args);

// Add detailed logging
builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.SetMinimumLevel(LogLevel.Debug);

// Add services
builder.Services.AddReverseProxy()
    .LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"));

builder.Services.AddCors(options => {
    options.AddPolicy("customPolicy", b => {
        b.AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials()
            .WithOrigins(builder.Configuration["ClientApp"]!);
    });
});

var app = builder.Build();

// Detailed request logging
app.Use(async (context, next) => {
    var logger = context.RequestServices.GetRequiredService<ILogger<Program>>();
    logger.LogInformation("=== INCOMING REQUEST ===");
    logger.LogInformation($"Method: {context.Request.Method}");
    logger.LogInformation($"Path: {context.Request.Path}");
    logger.LogInformation($"QueryString: {context.Request.QueryString}");
    
    await next();
    
    logger.LogInformation($"Response Status: {context.Response.StatusCode}");
    logger.LogInformation("=== REQUEST COMPLETE ===");
});

// Simple health check
app.MapGet("/health", () => Results.Ok(new { 
    status = "Gateway is running", 
    timestamp = DateTime.UtcNow 
}));

// CORS must be before MapReverseProxy
app.UseCors("customPolicy");

app.MapReverseProxy();

app.Run();