using System.Text.Json;
using System.Threading;using WebApplication1;

namespace WebApplication1
{
    public class GestorTarea
    {

        private List<Tarea> _tareas = new List<Tarea>();
        private const string ArchivoTareas = "Tareas.json";

        public GestorTarea()
        {
            CargarTarea();
        }

        public List<Tarea> tareas
        {
            get { return this._tareas; }
            set { this._tareas = value; }
        }


        public bool EliminarColeccion()
        {
            try
            {
                if (File.Exists(ArchivoTareas))
                {
                    File.Delete(ArchivoTareas);
                    _tareas = new List<Tarea>();
                    return true;
                }
                return false;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error al intentar eliminar el archivo: {ex.Message}");
                return false;
            }
        }


        public void GuardarTarea()
        {
            string jsonString = JsonSerializer.Serialize(tareas, new JsonSerializerOptions { WriteIndented = true });
            File.WriteAllText(ArchivoTareas, jsonString);
        }



        public void AgregarTarea(string nombre, string descripcion)
        {
            int nuevoId = GenerarNuevoId();

            Tarea nuevaTarea = new Tarea(nuevoId, nombre, descripcion);
            tareas.Add(nuevaTarea);
            GuardarTarea();
        }

        public void CargarTarea()
        {
            if (File.Exists(ArchivoTareas))
            {
                string jsonString = File.ReadAllText(ArchivoTareas);
                tareas = JsonSerializer.Deserialize<List<Tarea>>(jsonString);
            }
            else
            {
                tareas = new List<Tarea>();
            }
        }

        public List<Tarea> ObtenerTodas()
        {
            return tareas;
        }



        private int GenerarNuevoId()
        {
            if (tareas.Count == 0)
            {
                return 1;
            }

            return tareas.Max(t => t.id) + 1;
        }

        public bool MarcarCompleted(int id)
        {
            Tarea tarea = tareas.FirstOrDefault(t => t.id == id);
            if (tarea == null)
            {
                return false;
            }

            else
            {
                tarea.completed = true;
                GuardarTarea();
            }
            return true;
        }


        public List<Tarea> ObtenerPendientes()
        {
            return tareas.Where(t => !t.completed).ToList();
        }

        public List<Tarea> ObtenerCompletadas()
        {
            return tareas.Where(t => t.completed).ToList();
        }
    }
}
