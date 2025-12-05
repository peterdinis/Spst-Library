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

app.Use(async (context, next) => {
    var logger = context.RequestServices.GetRequiredService<ILogger<Program>>();
    
    // Fixed: Use constant template strings with placeholders
    logger.LogInformation("=== INCOMING REQUEST ===");
    logger.LogInformation("Method: {Method}", context.Request.Method);
    logger.LogInformation("Path: {Path}", context.Request.Path);
    logger.LogInformation("QueryString: {QueryString}", context.Request.QueryString);
    
    await next();
    
    logger.LogInformation("Response Status: {StatusCode}", context.Response.StatusCode);
    logger.LogInformation("=== REQUEST COMPLETE ===");
});

// Simple health check
app.MapGet("/health", () => Results.Ok(new { 
    status = "Gateway is running", 
    timestamp = DateTime.UtcNow 
}));

// Debug endpoint with constant template strings
app.MapGet("/debug", (IProxyConfigProvider proxyConfigProvider, ILogger<Program> logger) => {
    try {
        var config = proxyConfigProvider.GetConfig();
        
        logger.LogInformation("Debug endpoint accessed. Routes: {RouteCount}, Clusters: {ClusterCount}", 
            config.Routes.Count, config.Clusters.Count);
        
        var routes = config.Routes.Select(route => new {
            routeId = route.RouteId,
            match = route.Match?.Path,
            clusterId = route.ClusterId,
            order = route.Order
        }).ToList();

        var clusters = config.Clusters.Select(cluster => new {
            clusterId = cluster.ClusterId,
            destinations = cluster.Destinations?.Select(d => new {
                id = d.Key,
                address = d.Value.Address
            })
        }).ToList();

        return Results.Json(new {
            status = "Gateway configuration",
            routesCount = routes.Count,
            clustersCount = clusters.Count,
            routes = routes,
            clusters = clusters,
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