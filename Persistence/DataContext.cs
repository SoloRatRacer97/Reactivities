using Domain;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
    // Recall that we are just deriving this class from a DbContext class offered by Microsoft Entitiy Framework Core
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions options) : base(options)
        {
        }
        // Again this setting up the table properties for the DbSet for SQLite. "Activities" will be the name of our database table
        public DbSet<Activity> Activities { get; set; }
    }
}