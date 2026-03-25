using System.Text.Json;

namespace GestorClientes
{
    public class GestorClientes
    {
        private List<Cliente> _clientes = new List<Cliente>();
        private const string ArchivoClientes = "Clientes.Json";

        public GestorClientes()
        {
            CargarClientes();
        }



        public List<Cliente> clientes 
        { 
            get => this._clientes; 
            set => this._clientes = value; 
        }


        public void AgregarClientes(string name, string email, int phone, estadoCliente estado, DateTime date)
        {
            int NuevoId = GenerarNuevoId();

            Cliente clientete = new Cliente(NuevoId, name, email, phone, estado, date);
            clientes.Add(clientete);
            GuardarCliente();
        }

        public void GuardarCliente()
        {
            string json = JsonSerializer.Serialize(clientes, new JsonSerializerOptions { WriteIndented = true });
            File.WriteAllText(ArchivoClientes, json);
        }

        public void CargarClientes()
        {
            if (File.Exists(ArchivoClientes))
            {
                string json = File.ReadAllText(ArchivoClientes);
                clientes = JsonSerializer.Deserialize<List<Cliente>>(json);
            }
            else
            { 
                clientes = new List<Cliente>();
            }
        }

        public int GenerarNuevoId()
        {
            if (clientes.Count == 0)
            {
                return 1;
            }

            return clientes.Max(c => c.id) + 1;
        }

        public List<Cliente> ObtenerColeccion()
        { 
            return clientes;
        }

        public Cliente ObtenerPorId(int id)
        {
            Cliente clienteId = clientes.FirstOrDefault(c => c.id == id);
            return clienteId;
        }


        public bool EliminarColeccion()
        {

            try
            {

                if (File.Exists(ArchivoClientes))
                {
                    File.Delete(ArchivoClientes);
                    _clientes = new List<Cliente>();
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

        public bool EliminarPorId(int id)
        {

            Cliente clienteId = clientes.FirstOrDefault(c => c.id == id);

            if (clienteId == null)
            {
                return false;
            }

            if (clienteId.estado == estadoCliente.Desactivado)
            {
                return false;
            }

            clientes.Remove(clienteId);
            GuardarCliente();
            return true;
        }


        public bool CambiarEstado(int id, estadoCliente nuevoEstado)
        {
            Cliente clienteId = clientes.FirstOrDefault(c => c.id == id);

            if (clienteId == null)
            {
                return false;
            }

            clienteId.estado = nuevoEstado;
            return true;
        }


        public bool CambiarEmail(int id, string nuevoEmail)
        {
            Cliente clienteId = clientes.FirstOrDefault(c => c.id == id);

            if (clienteId == null)
            {
                return false;
            }

            clienteId.email = nuevoEmail;
            return true;
        }
    }
}
