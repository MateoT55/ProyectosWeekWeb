namespace ToDo_DB.Models
{
    public class ToDo
    {

        private int _id;
        private string _nombre;
        private string _descripcion;
        private bool _completada;

        public ToDo(int id, string nombre, string descripcion, bool completada)
        {
            this.id = id;
            this.nombre = nombre;
            this.descripcion = descripcion;
            this.completada = completada;
        }


        public int id
        {
            get => this._id;
            set => this._id = value;
        }

        public string nombre
        {
            get => this._nombre;
            set => this._nombre = value;
        }

        public string descripcion
        {
            get => this._descripcion;
            set => this._descripcion = value;
        }

        public bool completada
        {
            get => this._completada;
            set => this._completada = value;
        }

    }
}
