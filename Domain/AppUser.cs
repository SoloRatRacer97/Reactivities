using Microsoft.AspNetCore.Identity;

namespace Domain
{
    public class AppUser : IdentityUser
    {
        // These are just the additional properties that we want to track on top of what the IdentityUser already provides for us.
        public string DisplayName { get; set; }
        public string Bio { get; set; }
    }
}