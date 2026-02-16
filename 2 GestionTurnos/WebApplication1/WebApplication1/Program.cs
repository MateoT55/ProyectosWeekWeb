using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;


var builder = WebApplication.CreateBuilder(args);



builder.Services.AddControllers();


builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddControllers();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", p =>
    {
        p.AllowAnyOrigin()
        .AllowAnyHeader()
        .AllowAnyMethod();
    });
});
    
    
    
 


var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwagger();
    app.UseSwaggerUI();
}


app.UseCors();

app.MapControllers();

app.Run();
