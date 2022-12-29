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

        // This is another Dbset for the joined tables. 
        public DbSet<ActivityAttendee> ActivityAttendees { get; set; }

        // Need to override the IdentityDbContext.... Not sure why..?
        // This is the configuration to our many to many relationship:
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Making a new entity that has a primary key that incorperates the user ID and the activity ID:
            builder.Entity<ActivityAttendee>(x => x.HasKey(aa => new {aa.AppUserId, aa.ActivityId}));

            // I think these are the two joins for the two tables here. This should create the realtionship between the two entities so we join them and they can relate to each other.
            builder.Entity<ActivityAttendee>()
            .HasOne(u => u.AppUser)
            .WithMany(a => a.Activities)
            .HasForeignKey(aa => aa.AppUserId);

            builder.Entity<ActivityAttendee>()
            .HasOne(u => u.Activity)
            .WithMany(a => a.Attendees)
            .HasForeignKey(aa => aa.ActivityId);
        }      
    }
}