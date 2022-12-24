using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class RegisterDto
    {
        [Required]
        public string DisplayName { get; set; }
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        [Required]
        // Regular expression for a complex password:
        [RegularExpression("(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{4-8}$", ErrorMessage = "Password must be compelex")]
        public string Password { get; set; }
        [Required]
        public string Username { get; set; }
    }
}