using Microsoft.EntityFrameworkCore;
using CategoryService.Data;
using CategoryService.Validators;
using FluentValidation;
using FluentValidation.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllers();

builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddValidatorsFromAssemblyContaining<CategoryValidator>();

var app = builder.Build();

app.UseAuthorization();

app.MapControllers();

app.Run();
