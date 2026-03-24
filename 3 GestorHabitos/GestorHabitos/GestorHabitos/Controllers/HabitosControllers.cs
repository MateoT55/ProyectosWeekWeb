using GestorHabitos;
using Microsoft.AspNetCore.Mvc;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace GestorHabitos.Controllers
{
    [ApiController]
    [Route("api/Habitos")]
    public class HabitosControllers: ControllerBase
    {
        private static GestorHabitos gestor = new GestorHabitos();

        [HttpGet]
        public IActionResult ObtenerColeccion()
        { 
            return Ok(gestor.ObtenerColeccion());
        }

        [HttpGet("{id}")]
        public IActionResult ObtenerId(int id)
        { 
            gestor.ObtenerId(id);
            return Ok();
        }

        [HttpPost]
        public IActionResult CrearHabito([FromBody] HabitoDTO dto)
        { 
            if (dto == null || string.IsNullOrWhiteSpace(dto.name) || string.IsNullOrWhiteSpace(dto.desc))
            {
                return BadRequest("Name y Desc Obligatorios.");
                
            }
            gestor.AgregarHabito(dto.name, dto.desc, dto.estado, dto.date);
            return Ok();
        }

        [HttpPut("{id}")]
        public IActionResult CambiarEstado(int id, [FromBody] CambiarEstadoDTO datos)
        {
            bool ok = gestor.CambiarEstado(id, datos.estado);
            if (!ok)
            {
                return NotFound();
            }
            return Ok();
        }

        [HttpDelete]
        public IActionResult EliminarColeccion()
        {
            gestor.EliminarColeccion();
            return Ok();   
        }

        [HttpDelete("{id}")]
        public IActionResult EliminarId(int id)
        { 
            gestor.EliminarId(id);
            return Ok();
        }
    }
}
public class HabitoDTO
{
    public string name { get; set; }
    public string desc { get; set; }
    public estadoHabit estado { get; set; }
    public DateTime date { get; set; }
}