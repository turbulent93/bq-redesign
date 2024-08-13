namespace BqApi.Requests.Users
{
    public class UserDto
    {
        public int? Id { get; set; }
        public string Login { get; set; } = null!;
        public string? Password { get; set; } = null!;
        public string? NewPassword { get; set; } = null!;
        public string Role { get; set; } = null!;

        public EmployeeDto? Employee { get; set; }
    }
}
