using BqApi.Requests.Users;

namespace BqApi.Requests.Tokens
{
    public class CheckResultDto
    {
        public string Result { get; set; } = null!;
        public UserDto? CurrentUser { get; set; }
    }
}
