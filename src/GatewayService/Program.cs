using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

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

// Simple health check first
app.MapGet("/health", () => {
    return Results.Ok(new { 
        status = "Gateway is running", 
        timestamp = DateTime.UtcNow 
    });
});

// Debug endpoint
app.MapGet("/debug/routes", (HttpContext context) => {
    var logger = context.RequestServices.GetRequiredService<ILogger<Program>>();
    
    try {
        var config = app.Services.GetRequiredService<IReverseProxyConfig>();
        var destinations = app.Services.GetRequiredService<IReverseProxyDestinations>();
        
        return Results.Json(new {
            status = "Debug information",
            configLoaded = config != null,
            destinationsLoaded = destinations != null,
            timestamp = DateTime.UtcNow
        });
    }
    catch (Exception ex) {
        logger.LogError(ex, "Error in debug endpoint");
        return Results.Json(new { 
            error = ex.Message,
            stackTrace = ex.StackTrace
        });
    }
});

// CORS must be before MapReverseProxy
app.UseCors("customPolicy");

app.MapReverseProxy();

app.Run();