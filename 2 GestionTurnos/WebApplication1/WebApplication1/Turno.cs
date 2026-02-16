namespace WebApplication1
{
    public enum EstadoTurno
    { 
        Pendiente,
        Confirmado,
        Cancelado,
        Finalizado
    }

    public class Turno
    {
        private int _id;
        private string _cliente;
        private string _date;
        private EstadoTurno _estado;

        public Turno(int id, string cliente, string date, EstadoTurno estado)
        { 
            this.id = id;
            this.cliente = cliente;
            this.date = date;
            this.estado = estado;
        }




        public int id 
        { 
            get { return this._id; } 
            set { this._id = value; } 
        }

        public string cliente
        { 
            get { return this._cliente; }
            set { this._cliente = value; }
        }

        public string date
        { 
            get { return this._date; }
            set { this._date = value; }
        }

        public EstadoTurno estado
        {
            get { return this._estado; }
            set { this._estado = value; }
        }
    }
}
