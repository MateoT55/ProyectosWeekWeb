using Microsoft.AspNetCore.Mvc;

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
