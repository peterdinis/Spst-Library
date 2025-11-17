var builder = WebApplication.CreateBuilder(args);

builder.Services.AddReverseProxy().LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"));

builder.Services.AddCors(options => {
    options.AddPolicy("customPolicy", b => {
        b.AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials()
            .WithOrigins(builder.Configuration["ClientApp"]!);
    });
});

var app = builder.Build();

app.MapReverseProxy();

app.UseCors();

app.UseAuthentication();
app.UseAuthorization();