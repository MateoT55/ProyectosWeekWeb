using Microsoft.AspNetCore.Mvc;
using WebApplication1;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("api/turnos")]
    public class TurnosController: ControllerBase
    {
        private static GestorTurno gestor = new GestorTurno();

        [HttpGet]
        public IActionResult ObtenerColeccion()
        {
            return Ok(gestor.ObtenerCollecion());
        }

        [HttpPost]
        public IActionResult CrearTurno([FromBody] TurnoDTO dto)
        { 
            if (dto == null || string.IsNullOrWhiteSpace(dto.cliente) || string.IsNullOrWhiteSpace(dto.date))
            { 
                return BadRequest("Name y Date obligaorios.");
            }
            gestor.AgregarTurno(dto.cliente, dto.date, dto.estado);
            return Ok();
        }




    }
}



public class TurnoDTO
{
    public string cliente { get; set; }
    public string date { get; set; }
    public EstadoTurno estado { get; set; }
}