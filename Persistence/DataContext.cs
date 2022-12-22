using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
    public class DataContext : IdentityDbContext<AppUser>
    {
        public DataContext(DbContextOptions options) : base(options)
        {
        }
        // Again this setting up the table properties for the DbSet for SQLite. "Activities" will be the name of our database table
        public DbSet<Activity> Activities { get; set; }
    }
}