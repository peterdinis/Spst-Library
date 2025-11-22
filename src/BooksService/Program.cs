using Microsoft.EntityFrameworkCore;
using BooksService.Data;
using BooksService.Validators;
using FluentValidation;
using BooksService.Services;
using BooksService.Interfaces;
using FluentValidation.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllers();

builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddValidatorsFromAssemblyContaining<BookValidator>();
builder.Services.AddScoped<IRabbitMQService, RabbitMQService>();

var app = builder.Build();

app.UseAuthorization();

app.MapControllers();

app.Run();
