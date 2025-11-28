var builder = WebApplication.CreateBuilder(args);

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

// Add authentication and authorization if needed
builder.Services.AddAuthentication();
builder.Services.AddAuthorization();

var app = builder.Build();

// Middleware in correct order
app.UseRouting();

app.UseCors("customPolicy"); // Use the named policy

app.Map("/debug", async (HttpContext context) => {
    var config = context.RequestServices.GetRequiredService<IProxyConfigProvider>();
    return Results.Json(new {
        routes = config.GetConfig().Routes,
        clusters = config.GetConfig().Clusters
    });
});

app.UseAuthentication(); 
app.UseAuthorization();

app.MapReverseProxy();

app.Run();