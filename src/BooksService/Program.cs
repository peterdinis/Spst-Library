using Microsoft.EntityFrameworkCore;
using BooksService.Data;
using BooksService.Validators;
using FluentValidation;
using BooksService.Services;
using BooksService.Interfaces;
using FluentValidation.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// Database context
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// Controllers
builder.Services.AddControllers();

// FluentValidation
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddValidatorsFromAssemblyContaining<BookValidator>();

// Services
builder.Services.AddScoped<IRabbitMQService, RabbitMQService>();
builder.Services.AddSingleton<IResiliencePolicyService, ResiliencePolicyService>();

// Optional: Swagger/OpenAPI for development
builder.Services.AddEndpointsApiExplorer();

var app = builder.Build();

app.UseAuthorization();

app.MapControllers();

app.Run();