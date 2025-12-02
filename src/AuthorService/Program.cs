using Microsoft.EntityFrameworkCore;
using AuthorService.Data;
using AuthorService.Validators;
using FluentValidation;
using FluentValidation.AspNetCore;
using AuthorService.Services;
using AuthorService.Interfaces;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllers();

builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddValidatorsFromAssemblyContaining<AuthorValidator>();
builder.Services.AddScoped<IBookService, BookService>();
builder.Services.AddSingleton<IResiliencePolicyService, ResiliencePolicyService>();

var app = builder.Build();

app.UseAuthorization();

app.MapControllers();

app.Run();
