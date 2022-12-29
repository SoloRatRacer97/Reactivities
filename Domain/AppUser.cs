using Microsoft.AspNetCore.Identity;

namespace Domain
{
    public class AppUser : IdentityUser
    {
        // These are just the additional properties that we want to track on top of what the IdentityUser already provides for us.
        public string DisplayName { get; set; }
        public string Bio { get; set; }
        // This is what sets up the join on both rables for us, I think:
        public ICollection<ActivityAttendee> Activities { get; set; }
    }
}