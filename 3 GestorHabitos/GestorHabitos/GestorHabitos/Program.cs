// Voy a crear una app web y empezar a configurarla
var builder = WebApplication.CreateBuilder(args);


// Sirve para ver y probar mi API en la web
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


// Añado los controladores
builder.Services.AddControllers();

// Habilitar CORS para que el frontend (localhost, cualquier puerto) pueda llamar --- Dejá pasar cualquier frontend (por ahora)

builder.Services.AddCors(options =>
{
    options.AddPolicy("MiPoliticaCORS", p =>
    {
        p.AllowAnyOrigin()
         .AllowAnyHeader()
         .AllowAnyMethod();
    });
});



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



// Aca empieza la contruccion


// Aca se empieza la construccion con todo lo definido anteriormente
var app = builder.Build();


// Si estoy desarrollando dame errores claros y Swagger
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("MiPoliticaCORS");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
