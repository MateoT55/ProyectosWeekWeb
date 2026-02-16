using Microsoft.AspNetCore.Mvc;
using WebApplication1;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("api/tareas")]
    public class TareasController : ControllerBase
    {
        private static GestorTarea gestor = new GestorTarea();

        [HttpGet]
        public IActionResult ObtenerTodas()
        {
            return Ok(gestor.ObtenerTodas());
        }

        [HttpGet("pendientes")]
        public IActionResult ObtenerPendientes()
        {
            return Ok(gestor.ObtenerPendientes());
        }

        [HttpGet("completadas")]
        public IActionResult ObtenerCompletadas()
        {
            return Ok(gestor.ObtenerCompletadas());
        }

        [HttpPost]
        public IActionResult CrearTarea([FromBody] TareaDTO dto)
        {
            if (dto == null || string.IsNullOrWhiteSpace(dto.Name) || string.IsNullOrWhiteSpace(dto.Description))
                return BadRequest("Name y Description obligatorios.");

            gestor.AgregarTarea(dto.Name, dto.Description);
            return Ok();
        }

        [HttpPut("{id}")]
        public IActionResult MarcarCompletada(int id)
        {
            bool ok = gestor.MarcarCompleted(id);
            if (!ok) return NotFound();
            return Ok();
        }

        [HttpDelete]
        public IActionResult EliminarTodas()
        {
            gestor.EliminarColeccion();
            return Ok();
        }
    }

    public class TareaDTO
    {
        public string Name { get; set; }
        public string Description { get; set; }
    }
}
