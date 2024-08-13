using BqApi.Models;
using BqApi.Requests.Users;
using System.ComponentModel.DataAnnotations;

namespace BeautyQueenApi.Models
{
    public class Employee(string fullName, int userId, int fileId)
    {
        [Key]
        public int Id { get; set; }
        public string FullName { get; set; } = fullName;
        public int UserId { get; set; } = userId;
        public int FileId { get; set; } = fileId;
        public bool NotificationsEnabled { get; set; } = false;
        public string AuthTgCode { get; set; } = Guid.NewGuid().ToString();
        public string? TgChatId { get; set; }

        public List<Specialization> Specializations { get; set; } = null!;
        public User User { get; set; } = null!;
        public UploadedFile File { get; set; } = null!;

        public void Update(EmployeeDto request)
        {
            FullName = request.FullName;
            UserId = request.UserId;
            FileId = request.FileId;
            NotificationsEnabled = (bool)request.NotificationsEnabled!;
        }

        public void UpdateChatId(string chatId)
        {
            TgChatId = chatId;
        }
    }
}
