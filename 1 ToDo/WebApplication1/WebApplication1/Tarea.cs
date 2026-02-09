namespace WebApplication1
{
    public class Tarea
    {


        private int _id;
        private string _name;
        private string _description;
        private bool _completed;



        public Tarea(int id, string name, string description)
        {

            this.id = id;
            this.name = name;
            this.description = description;
            this.completed = false;
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

        public string description
        {
            get { return this._description; }
            set { this._description = value; }
        }

        public bool completed
        {
            get { return this._completed; }
            set { this._completed = value; }
        }

    }
}
