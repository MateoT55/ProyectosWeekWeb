using Microsoft.EntityFrameworkCore;
using ToDo_DB.Models;

namespace ToDo_DB.Contexts
{
    public class TaskContext: DbContext
    {
        public DbSet<ToDo> ToDo { get; set; }

        public TaskContext(DbContextOptions<TaskContext> options) : base(options) 
        { 
        
        }


    }
}
