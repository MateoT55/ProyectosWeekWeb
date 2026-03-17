namespace GestorHabitos
{
    public enum estadoHabit
    {
        Pendiente,
        Cumplido
    }
    

    public class Habito
    {
        private int _id;
        private string _name;
        private string _desc;
        private estadoHabit _estado;
        private DateTime _date;



        public Habito(int id, string name, string desc, estadoHabit estado, DateTime date)
        {
            this.id = id;
            this.name = name;
            this.desc = desc;
            this.estado = estado;
            this.date = date;
        }

        public int id
        { 
            get { return this._id; }
            set { this._id = value; } 
        }

        public string name
        {
            get { return this._name; }
            set { this._name = value; }
        }

        public string desc
        {
            get { return this._desc; }
            set { this._desc = value; }
        }

        public estadoHabit estado
        {
            get { return this._estado; }
            set { this._estado = value; }
        }

        public DateTime date
        {
            get { return this._date; }
            set { this._date = value; }
        }
    }
}
