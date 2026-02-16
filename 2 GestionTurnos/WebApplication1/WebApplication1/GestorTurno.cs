using System.Text.Json;
using System.Threading;
using WebApplication1;

namespace WebApplication1
{
    public class GestorTurno
    {
        private List<Turno> _turnos = new List<Turno>();
        private const string ArchivoTurnos = "Turnos.json";

        public GestorTurno()
        {
            CargarTurno();
        }

        public List<Turno> turnos
        {
            get { return this._turnos; }
            set { this._turnos = value; }
        }


        public bool EliminarColeccion()
        {
            try
            {
                if (File.Exists(ArchivoTurnos))
                {
                    File.Delete(ArchivoTurnos);
                    _turnos = new List<Turno>();
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


        public void GuardarTurno()
        {
            string jsonString = JsonSerializer.Serialize(turnos, new JsonSerializerOptions { WriteIndented = true });
            File.WriteAllText(ArchivoTurnos, jsonString);
        }

        public void AgregarTurno(string cliente, string date, EstadoTurno estado)
        {
            int nuevoId = GenerarNuevoId();

            Turno NuevoTurno = new Turno(nuevoId, cliente, date, estado);
            turnos.Add(NuevoTurno);
            GuardarTurno();
        }



        public void CargarTurno()
        {
            if (File.Exists(ArchivoTurnos))
            {
                string jsonString = File.ReadAllText(ArchivoTurnos);
                turnos = JsonSerializer.Deserialize<List<Turno>>(jsonString);
            }
            else
            {
                turnos = new List<Turno>();
            }
        }


        private int GenerarNuevoId()
        {
            if (turnos.Count == 0)
            {
                return 1;
            }
            return turnos.Max(t => t.id) + 1;
        }

        public List<Turno> ObtenerCollecion()
        { 
            return turnos;
        }


        public bool CambiarEstado(int idTurno, EstadoTurno nuevoEstado)
        {

            Turno turno = turnos.FirstOrDefault(t => t.id == idTurno);

            if (turno == null)
            {
                return false;
            }
            else 
            {
                turno.estado = nuevoEstado;
                return true;
            }


        }

    }
}
