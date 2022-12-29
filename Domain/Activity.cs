// The Activity here is in our domain which everything depends on. It holds the core functionality of our project since we are basing this one around acitivites. Then, the logic is built on top of this to build out the application. This is kind of laying the very foundation for what we are doing.

namespace Domain
{
    public class Activity
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public DateTime Date { get; set; }
        public string Description { get; set; }
        public string Category { get; set; }
        public string City { get; set; }
        public string Venue { get; set; }
        public bool isCancelled { get; set; }
        // This is what sets up the join on both rables for us, I think:
        // Note that we need to initialize it so that we can add things to it. If this is set to null originally, then we cannot add anything to it later on.
        public ICollection<ActivityAttendee> Attendees { get; set; } = new List<ActivityAttendee>();
    }
}