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

// Debug middleware
app.Use(async (context, next) => {
    var logger = context.RequestServices.GetRequiredService<ILogger<Program>>();
    
    logger.LogInformation("=== INCOMING REQUEST ===");
    logger.LogInformation("Method: {Method}", context.Request.Method);
    logger.LogInformation("Path: {Path}", context.Request.Path);
    logger.LogInformation("QueryString: {QueryString}", context.Request.QueryString);
    logger.LogInformation("OriginalPath: {OriginalPath}", context.Request.Path.Value);
    logger.LogInformation("OriginalQueryString: {OriginalQueryString}", context.Request.QueryString.Value);
    
    await next();
    
    logger.LogInformation("Response Status: {StatusCode}", context.Response.StatusCode);
    logger.LogInformation("=== REQUEST COMPLETE ===");
});

// Simple health check
app.MapGet("/health", () => Results.Ok(new { 
    status = "Gateway is running", 
    timestamp = DateTime.UtcNow 
}));

// Debug endpoint
app.MapGet("/debug", (IProxyConfigProvider proxyConfigProvider, ILogger<Program> logger) => {
    try {
        var config = proxyConfigProvider.GetConfig();
        
        var routes = config.Routes.Select(route => new {
            route.RouteId,
            route.Match?.Path,
            route.ClusterId,
            route.Order,
            Transforms = route.Transforms?.Select(t => t.GetType().Name)
        }).ToList();

        var clusters = config.Clusters.Select(cluster => new {
            cluster.ClusterId,
            Destinations = cluster.Destinations?.Select(d => new {
                d.Key,
                Address = d.Value.Address
            }).ToList()
        }).ToList();

        return Results.Json(new {
            status = "Gateway configuration",
            routesCount = routes.Count,
            clustersCount = clusters.Count,
            routes,
            clusters,
            timestamp = DateTime.UtcNow
        });
    }
    catch (Exception ex) {
        logger.LogError(ex, "Error in debug endpoint");
        return Results.Json(new { 
            error = ex.Message,
            details = ex.GetType().Name,
            timestamp = DateTime.UtcNow
        }, statusCode: 500);
    }
});

// CORS must be before MapReverseProxy
app.UseCors("customPolicy");

app.MapReverseProxy();

app.Run();