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
    }
}