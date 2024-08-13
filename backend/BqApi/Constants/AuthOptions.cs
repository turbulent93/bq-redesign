using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace BeautyQueenApi.Constants
{
    public class AuthOptions
    {
        public const string INIT_ADMIN_ROLE_NAME = "Админ";
        public const string INIT_ADMIN_LOGIN = "admin";
        public const string INIT_USER_PASSWORD = "Sk3E23r";

        const string KEY = "L2AaFLc28x28j2zqbz2Eq2cUsjd7D&@DHS7ahda7sda7sdha";
        public const int ACCESS_TOKEN_LIFETIME = 1;
        public const int REFRESH_TOKEN_LIFETIME = 3;

        public const bool ValidateAudience = false;
        public const bool ValidateIssuer = false;
        public const bool ValidateIssuerSigningKey = true;
        public static SymmetricSecurityKey GetSymmetricSecurityKey()
        {
            return new SymmetricSecurityKey(Encoding.ASCII.GetBytes(KEY));
        }
    }
}
