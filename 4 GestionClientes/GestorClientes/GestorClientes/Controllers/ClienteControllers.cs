using GestorClientes;
using Microsoft.AspNetCore.Mvc;

namespace GestorClientes.Controllers
{
    [ApiController]
    [Route("api/Clientes")]
    public class ClienteControllers : ControllerBase
    {
        private static GestorClientes gestor = new GestorClientes();

        [HttpGet]
        public IActionResult ObtenerColeccion()
        {
            return Ok(gestor.ObtenerColeccion());
        }

        [HttpGet("{id}")]
        public IActionResult ObtenerPorId(int id)
        {
            gestor.ObtenerPorId(id);
            return Ok();
        }


        [HttpPost]
        public IActionResult AgregarCliente([FromBody] ClienteDTO dto)
        {
            gestor.AgregarClientes(dto.name, dto.email, dto.phone, dto.estado, dto.date);
            return Ok();
        }

        [HttpPut("{id}")]
        public IActionResult CambiarEstado(int id, estadoCliente nuevoEstado)
        {
            bool ok = gestor.CambiarEstado(id, nuevoEstado);
            return Ok();
        }

        [HttpPut]
        public IActionResult CambiarEmail(int id, string nuevoEmail)
        {
            bool ok = gestor.CambiarEmail(id, nuevoEmail);
            return Ok();
        }

        [HttpDelete]
        public IActionResult EliminarColeccion()
        { 
            gestor.EliminarColeccion();
            return Ok();
        }

        [HttpDelete("{id}")]
        public IActionResult EliminarPorId(int id)
        { 
            gestor.EliminarPorId(id);
            return Ok();
        }
    }
}


public class ClienteDTO
{ 
    public string name { get; set; }
    public string email { get; set; }
    public int phone { get; set; }
    public estadoCliente estado { get; set; }
    public DateTime date { get; set; }
}