using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
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
    logger.LogInformation($"Headers: {string.Join(", ", context.Request.Headers.Select(h => $"{h.Key}={h.Value}"))}");
    
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
app.MapGet("/debug", (HttpContext context) => {
    var logger = context.RequestServices.GetRequiredService<ILogger<Program>>();
    
    try {
        logger.LogInformation("Debug endpoint called");
        
        // Check if ReverseProxy is configured
        var configProvider = context.RequestServices.GetService<IProxyConfigProvider>();
        if (configProvider == null) {
            return Results.Json(new { error = "IProxyConfigProvider not available" });
        }
        
        var config = configProvider.GetConfig();
        
        var routes = config.Routes.Select(r => new {
            r.RouteId,
            Match = r.Match?.Path,
            r.ClusterId
        }).ToList();
        
        var clusters = config.Clusters.Select(c => new {
            c.ClusterId,
            Destinations = c.Destinations.Select(d => new {
                d.Key,
                Address = d.Value.Address
            }).ToList()
        }).ToList();
        
        return Results.Json(new {
            status = "Debug information",
            routesCount = routes.Count,
            clustersCount = clusters.Count,
            routes = routes,
            clusters = clusters
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