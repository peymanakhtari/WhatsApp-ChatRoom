using Microsoft.EntityFrameworkCore;
using System.Reflection.Metadata;
using whatsApp_chat.Data.models;

namespace whatsApp_chat.Data
{
    public class AppDbContext:DbContext
    {
        public DbSet<Message> Messages { get; set; }
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {

        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }

    }
}
