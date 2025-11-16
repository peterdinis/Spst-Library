using Microsoft.EntityFrameworkCore;
using PublisherService.Data;
using PublisherService.Validators;
using FluentValidation;
using FluentValidation.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllers();

builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddValidatorsFromAssemblyContaining<PublisherValidator>();

var app = builder.Build();

app.UseAuthorization();

app.MapControllers();

app.Run();
