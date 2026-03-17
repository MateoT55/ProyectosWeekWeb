using System.Text.Json;

namespace GestorHabitos
{
    public class GestorHabitos
    {
        private List<Habito> _habitos = new List<Habito>();
        private const string ArchivoHabitos = ("Habitos.Json");

        public GestorHabitos()
        {
            CargarHabito();
        }


        public List<Habito> habitos
        {
            get {  return this._habitos; }
            set { this._habitos = value; }
        }


        public void AgregarHabito(string name, string desc, estadoHabit estado, DateTime date)
        {
            int nuevoId = GenerarNuevoId();

            Habito NuevoHabito = new Habito(nuevoId, name, desc, estado, date);
            habitos.Add(NuevoHabito);
            GuardarHabito();
        }

        public void GuardarHabito()
        {
            string jsonString = JsonSerializer.Serialize(habitos, new JsonSerializerOptions { WriteIndented = true });
            File.WriteAllText(ArchivoHabitos, jsonString);
        }

        public void CargarHabito()
        {
            if (File.Exists(ArchivoHabitos))
            {
                string jsonString = File.ReadAllText(ArchivoHabitos);
                habitos = JsonSerializer.Deserialize<List<Habito>>(jsonString);
            }
            else
            {
                habitos = new List<Habito>();
            }
        }

        private int GenerarNuevoId()
        {
            if (habitos.Count == 0)
            {
                return 1;
            }
            return habitos.Max(h => h.id) + 1;
        }

        public bool EliminarColeccion()
        {
            try
            {
                if (File.Exists(ArchivoHabitos))
                { 
                    File.Delete(ArchivoHabitos);
                    _habitos = new List<Habito>();
                    return true;
                }
                else
                {
                    return false; 
                }
            }
            catch (Exception ex)
            { 
                return false;
            }
        }

        public bool EliminarId(int id)
        { 
            Habito habito = habitos.FirstOrDefault(h => h.id == id);

            if (habitos == null)
            {
                return false;
            }

            habitos.Remove(habito);
            GuardarHabito();
            return true;
        }

        public List<Habito> ObtenerColeccion()
        { 
            return habitos;
        }


        public List<Habito> ObtenerId(int id)
        {
            Habito habitoo = habitos.FirstOrDefault(h => h.id == id);
            return habitos;
        }

        public bool CambiarEstado(int id, estadoHabit nuevoEstado)
        {
            Habito habito = habitos.FirstOrDefault(h => h.id == id);

            if (habito == null)
            {
                return false;
            }
            else
            { 
                habito.estado = nuevoEstado;
                return true;
            }
        }

    }
}
