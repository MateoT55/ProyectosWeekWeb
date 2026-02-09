using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;


// ACA SE DEFINE TODO

// Voy a crear una app web y empezar a configurarla 
var builder = WebApplication.CreateBuilder(args);



// Quiero poder ver y probar mi API en el navegador
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Añadir controllers
builder.Services.AddControllers();



// Habilitar CORS para que el frontend (localhost, cualquier puerto) pueda llamar --- Dejá pasar cualquier frontend (por ahora)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", p =>
    {
        p.AllowAnyOrigin()
         .AllowAnyHeader()
         .AllowAnyMethod();
    });
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////






// ACA EMPIEZA LA CONSTRUCCION 



// Aca se empieza la construccion con todo lo definido anteriormente
var app = builder.Build();



// Si estoy desarrollando, dame errores claros y Swagger
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI();
}



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Usá la política CORS que definí antes
app.UseCors("AllowFrontend");
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



// Las rutas de mi aplicación salen de los Controllers
app.MapControllers();



// Arrancar el servidor
app.Run();
