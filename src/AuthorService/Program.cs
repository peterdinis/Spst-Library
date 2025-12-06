using Microsoft.EntityFrameworkCore;
using AuthorService.Data;
using AuthorService.Validators;
using FluentValidation;
using FluentValidation.AspNetCore;
using AuthorService.Services;
using AuthorService.Interfaces;
using AuthorService.Repositories;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllers();

builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddValidatorsFromAssemblyContaining<AuthorValidator>();
builder.Services.AddScoped<IBookService, BookService>();
builder.Services.AddSingleton<IResiliencePolicyService, ResiliencePolicyService>();
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddScoped<IAuthorRepository, AuthorRepository>();

var app = builder.Build();

app.UseAuthorization();

app.MapControllers();

// Apply migrations automatically
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    db.Database.Migrate();
}

app.Run();
