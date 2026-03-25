namespace GestorClientes
{
    public enum estadoCliente
    { 
        Activo,
        Desactivado
    }
    
    public class Cliente
    {
        private int _id;
        private string _name;
        private string _email;
        private int _phone;
        private estadoCliente _estado;
        private DateTime _date;

        public Cliente(int id, string name, string email, int phone, estadoCliente estado, DateTime date)
        {
            this.id = id;
            this.name = name;
            this.email = email;
            this.phone = phone;
            this.estado = estado;
            this.date = date;
        }

        public int id 
        { 
            get => this._id; 
            set => this._id = value; 
        }
        public string name 
        { 
            get => this._name;
            set
            {
                if (string.IsNullOrEmpty(value))
                {
                    throw new ArgumentNullException("El nombre no puede estar vacio.");
                }
                else 
                { 
                    this._name = value;
                }
            }
        }
        public string email 
        { 
            get => this._email;
            set
            {
                if (!value.Contains("@"))
                {
                    throw new ArgumentException("El email debe ser valido y contener arroba('@')");
                }
                else 
                { 
                    this._email = value;  
                }
            }
        }
        public int phone 
        { 
            get => this._phone; 
            set => this._phone = value; 
        }
        public estadoCliente estado 
        { 
            get => this._estado; 
            set => this._estado = value; 
        }
        public DateTime date 
        { 
            get => this._date; 
            set => this._date = value; 
        }
    }
}
