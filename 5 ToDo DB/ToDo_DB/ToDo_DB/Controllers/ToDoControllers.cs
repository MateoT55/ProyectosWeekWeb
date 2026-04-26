using Microsoft.AspNetCore.Mvc;
using ToDo_DB.Models;

namespace ToDo_DB.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ToDoControllers : ControllerBase
    {
        private readonly GestorToDo _gestor;

        public ToDoControllers(GestorToDo gestor)
        {
            _gestor = gestor;
        }

        // 🔹 GET: api/todo
        [HttpGet]
        public ActionResult<List<ToDo>> Get()
        {
            var tareas = _gestor.ListarTareas();
            return Ok(tareas);
        }

        // 🔹 GET: api/todo/{id}
        [HttpGet("{id}")]
        public ActionResult<ToDo> GetById(int id)
        {
            var tarea = _gestor.ObtenerPorId(id);

            if (tarea == null)
                return NotFound("Tarea no encontrada");

            return Ok(tarea);
        }

        // 🔹 POST: api/todo
        [HttpPost]
        public ActionResult Post([FromBody] ToDo tarea)
        {
            if (string.IsNullOrWhiteSpace(tarea.nombre))
                return BadRequest("El nombre es obligatorio");

            _gestor.AgregarTarea(tarea);

            return Ok("Tarea creada correctamente");
        }

        // 🔹 PUT: api/todo/{id}/completar
        [HttpPut("{id}/completar")]
        public ActionResult Completar(int id)
        {
            var resultado = _gestor.CompletarTarea(id);

            if (!resultado)
                return BadRequest("No se pudo completar la tarea");

            return Ok("Tarea completada");
        }

        // 🔹 PUT: api/todo/{id}
        [HttpPut("{id}")]
        public ActionResult Actualizar(int id, [FromBody] ToDo tarea)
        {
            if (string.IsNullOrWhiteSpace(tarea.nombre))
                return BadRequest("El nombre es obligatorio");

            var resultado = _gestor.ActualizarTarea(id, tarea.nombre, tarea.descripcion);

            if (!resultado)
                return NotFound("Tarea no encontrada");

            return Ok("Tarea actualizada");
        }

        // 🔹 DELETE: api/todo/{id}
        [HttpDelete("{id}")]
        public ActionResult Eliminar(int id)
        {
            var resultado = _gestor.EliminarTarea(id);

            if (!resultado)
                return NotFound("Tarea no encontrada");

            return Ok("Tarea eliminada");
        }
    }
}