using ToDo_DB.Models;
using ToDo_DB.Contexts;

namespace ToDo_DB
{
    public class GestorToDo
    {
        public List<ToDo> ToDo { get; set; }
        private readonly TaskContext _context;


        public GestorToDo(TaskContext context)
        {
            this._context = context;
        }


        // 🔹 Listar todas
        public List<ToDo> ListarTareas()
        {
            return _context.ToDo.ToList();
        }

        // 🔹 Obtener por ID
        public ToDo? ObtenerPorId(int id)
        {
            return _context.ToDo.FirstOrDefault(t => t.id == id);
        }

        // 🔹 Agregar
        public void AgregarTarea(ToDo tarea)
        {
            tarea.completada = false;

            _context.ToDo.Add(tarea);
            _context.SaveChanges();
        }

        // 🔹 Completar tarea
        public bool CompletarTarea(int id)
        {
            var tarea = _context.ToDo.FirstOrDefault(t => t.id == id);

            if (tarea == null)
                return false;

            if (tarea.completada)
                return false;

            tarea.completada = true;

            _context.SaveChanges();
            return true;
        }

        // 🔹 Eliminar
        public bool EliminarTarea(int id)
        {
            var tarea = _context.ToDo.FirstOrDefault(t => t.id == id);

            if (tarea == null)
                return false;

            _context.ToDo.Remove(tarea);
            _context.SaveChanges();

            return true;
        }

        // 🔹 Actualizar nombre o descripción (extra útil)
        public bool ActualizarTarea(int id, string nombre, string descripcion)
        {
            var tarea = _context.ToDo.FirstOrDefault(t => t.id == id);

            if (tarea == null)
                return false;

            tarea.nombre = nombre;
            tarea.descripcion = descripcion;

            _context.SaveChanges();
            return true;
        }
    }
}
