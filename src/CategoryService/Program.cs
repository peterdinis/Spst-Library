using Microsoft.EntityFrameworkCore;
using CategoryService.Data;
using CategoryService.Validators;
using FluentValidation;
using FluentValidation.AspNetCore;
using CategoryService.Interfaces;
using CategoryService.Services;
using CategoryService.Repositories;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllers();

builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddValidatorsFromAssemblyContaining<CategoryValidator>();
builder.Services.AddScoped<IBookService, BookService>();
builder.Services.AddSingleton<IResiliencePolicyService, ResiliencePolicyService>();

builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
builder.Services.AddScoped<CreateCategoryDtoValidator>();
builder.Services.AddScoped<UpdateCategoryDtoValidator>();

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
