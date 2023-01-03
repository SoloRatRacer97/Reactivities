// Comment entity for when we are sending chats back and forth with the server.

namespace Domain
{
    public class Comment
    {
        public int Id { get; set; }
        public string Body { get; set; }
        public AppUser Author { get; set; }
        public Activity Activity { get; set; }
        // Poperty for the date and time that the comment was sent to the SERVER. 
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}