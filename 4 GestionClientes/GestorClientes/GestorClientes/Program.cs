var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddControllers();


builder.Services.AddOpenApi();

var app = builder.Build();

builder.Services.AddCors(options =>
{
    options.AddPolicy("MiPoliticaCors", p =>
    {
        p.AllowAnyOrigin()
        .AllowAnyHeader()
        .AllowAnyMethod();
    });
});



if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("MiPoliticaCors");

app.UseAuthorization();

app.MapControllers();

app.Run();
