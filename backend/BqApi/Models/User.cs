using BeautyQueenApi.Requests.Users;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace BeautyQueenApi.Models
{
    [Index(nameof(Login), IsUnique = true)]
    public class User(string login, string password, string role)
    {
        [Key]
        public int Id { get; set; }
        public string Login { get; set; } = login;
        public string Password { get; set; } = password;
        public string? RefreshToken { get; set; }
        public DateTime? ExpiresIn { get; set; }
        public string Role { get; set; } = role;

        public Employee? Employee { get; set; } = null!;

        public void Update(string login, string? password, string role) {
            Login = login;
            if(password != null)
                Password = password;
            Role = role;
        }
    }
}
