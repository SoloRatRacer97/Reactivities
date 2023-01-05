// Sets up our database
// 1) Names the tables in the db.

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

        // Setting up a table for photos in the database incase we want to query that data.
        public DbSet<Photo> Photos { get; set; }
        // Setting up the table for the comments:
        public DbSet<Comment> Comments { get; set; }
        // Setting up a table for the following and followers functionality
        public DbSet<UserFollowing> UserFollowings { get; set; }

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

            builder.Entity<Comment>()
                .HasOne(a => a.Activity)
                .WithMany(c => c.Comments)
                // This cascades the deletion down through the comments if we delete an activity. 
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<UserFollowing>(b => {
                b.HasKey(k => new {k.ObserverId, k.TargetId});

                b.HasOne(o => o.Observer)
                    .WithMany(f => f.Followings)
                    .HasForeignKey(o => o.ObserverId)
                    // Here we DO want to delete the followings if the user deletes their profile. So, we will use cascade here again just like with the comments feature so that if the user doesnt exist, their followings and followers are also dropped form the databse.
                    .OnDelete(DeleteBehavior.Cascade);

                b.HasOne(t => t.Target)
                    .WithMany(f => f.Followers)
                    .HasForeignKey(t => t.TargetId)
                    .OnDelete(DeleteBehavior.Cascade);
            });
        }      
    }
}