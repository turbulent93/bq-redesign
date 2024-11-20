using BeautyQueenApi.Constants;
using BeautyQueenApi.Data;
using BeautyQueenApi.Models;
using BeautyQueenApi.Requests.Tokens;
using BqApi.Constants;
using BqApi.Requests.Tokens;
using BqApi.Requests.Users;
using BqApi.Services.TokenService;
using Mapster;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Parlot.Fluent;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Threading;

namespace BeautyQueenApi.Services.TokenService
{
    public class TokenService(ApplicationDbContext context) : ITokenService
    {
        private readonly ApplicationDbContext _context = context;

        public async Task<TokenDto> Register(TokenRequest request)
        {
            User? user = _context.User
                .FirstOrDefault(x => x.Login == request.Login);

            if(user == null)
            {
                user = new User(request.Login, request.Password, "Клиент", request.PunchMapId, null);

                _context.User.Add(user);

                await _context.SaveChangesAsync();

                if (request.PunchMapId != null)
                {
                    var promo = await _context.Promo.FirstOrDefaultAsync(i => i.Id == request.PromoId)
                        ?? throw new Exception(ErrorMessages.PROMO_ERROR);

                    user.Promos.Add(promo);
                }

                await _context.SaveChangesAsync();
            }

            if (request.Password == null)
            {
                return new TokenDto();
            } else
            {
                return await GetTokens(user);
            }
        }

        public async Task<TokenDto> Login(TokenRequest request)
        {
            User? user = _context.User
                .Include(i => i.Employee)
                .FirstOrDefault(x => x.Login == request.Login)
                    ?? throw new Exception(ErrorMessages.AUTHENTICATE_ERROR);
           
            if (!BCrypt.Net.BCrypt.Verify(request.Password, user.Password))
            {
                throw new Exception(ErrorMessages.AUTHENTICATE_ERROR);
            }

            return await GetTokens(user);
        }

        private async Task<TokenDto> GetTokens(User user)
        {
            var refreshToken = CreateRefreshToken();

            user.RefreshToken = refreshToken;

            user.ExpiresIn = DateTime.UtcNow.AddDays(AuthOptions.REFRESH_TOKEN_LIFETIME);

            await _context.SaveChangesAsync();

            return new TokenDto
            {
                AccessToken = CreateAccessToken(user),
                RefreshToken = refreshToken
            };
        }

        public async Task<TokenDto> Refresh(TokenDto tokenDto)
        {
            var claims = GetPrincipalFromToken(tokenDto.AccessToken);

            User? user = await _context
                    .User
                    .Include(i => i.Employee)
                    .FirstOrDefaultAsync(x => x.Id == claims.Id)
                ?? throw new Exception(ErrorMessages.USER_ERROR);

            if (user.RefreshToken != tokenDto.RefreshToken)
            {
                throw new Exception(ErrorMessages.INVALID_REFRESH_TOKEN);
            }

            return new TokenDto
            {
                AccessToken = CreateAccessToken(user),
                RefreshToken = user.RefreshToken
            };
        }

        public async Task<CheckResultDto> Check(TokenDto request)
        {
            var validation = new TokenValidationParameters {
                ValidateLifetime = true,
                IssuerSigningKey = AuthOptions.GetSymmetricSecurityKey()
            };

            var result = new JwtSecurityTokenHandler().ValidateTokenAsync(request.AccessToken, validation);

            if(!result.IsCompletedSuccessfully)
            {
                return new CheckResultDto
                {
                    Result = "Incorrect"
                };
            }

            var claims = GetPrincipalFromToken(request.AccessToken);

            var user = await _context
                .User
                .Include(i => i.Employee)
                .ThenInclude(i => i!.Specializations)
                .Include(i => i.Employee)
                .ThenInclude(i => i!.File)
                .Include(i => i.Appointments)
                .ThenInclude(i => i.Service)
                .Include(i => i.Appointments)
                .ThenInclude(i => i.Schedule)
                .Include(i => i.PunchMap)
                .ThenInclude(i => i!.PunchMapPromos)
                .ThenInclude(i => i.Promo)
                .Include(i => i.Promos)
                .FirstOrDefaultAsync(i => i.Id == claims.Id)
                    ?? throw new Exception(ErrorMessages.USER_ERROR);

            if (user.RefreshToken != request.RefreshToken)
            {
                return new CheckResultDto
                {
                    Result = "Incorrect"
                };
            }

            return new CheckResultDto
            {
                Result = "Correct",
                CurrentUser = user.Adapt<UserDto>()
            };
        }

        public string CreateAccessToken(User user)
        {
            List<Claim> claims =
            [
                new Claim("Id", user.Id.ToString()),
                new Claim("EmployeeId", user?.Employee != null ? user.Employee?.Id.ToString()! : ""),
                new Claim(ClaimTypes.Role, user?.Role!)
            ];

            var now = DateTime.UtcNow;
            var expires = now.AddDays(1).AddHours(-5);

            var jwt = new JwtSecurityToken(
                notBefore: now,
                claims: claims,
                expires: expires,
                signingCredentials: new SigningCredentials(AuthOptions.GetSymmetricSecurityKey(), SecurityAlgorithms.HmacSha256)
            );

            return new JwtSecurityTokenHandler().WriteToken(jwt);
        }

        public string CreateRefreshToken()
        {
            var refreshToken = new byte[256];
            var rng = RandomNumberGenerator.Create();

            rng.GetBytes(refreshToken);

            return Convert.ToBase64String(refreshToken);

            //return Guid.NewGuid().ToString();
        }

        public ClaimsResult GetPrincipalFromToken(string token)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateAudience = AuthOptions.ValidateAudience,
                ValidateIssuer = AuthOptions.ValidateIssuer,
                ValidateIssuerSigningKey = AuthOptions.ValidateIssuerSigningKey,
                IssuerSigningKey = AuthOptions.GetSymmetricSecurityKey(),
                ClockSkew = TimeSpan.Zero,
                ValidateLifetime = false
            };

            var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out SecurityToken validatedToken);

            var employeeId = GetClaim(principal.Claims, CustomClaimTypes.EmployeeId);

            return new ClaimsResult
            {
                Id = Int32.Parse(GetClaim(principal.Claims, CustomClaimTypes.Id)),
                EmployeeId = employeeId != "" ? Int32.Parse(employeeId) : null
            };
        }

        public string GetClaim(IEnumerable<Claim> claims, string claimType)
        {
            return claims
                .Where(c => c.Type == claimType)
                .Select(x => x.Value)
                .FirstOrDefault()!;
        }
    }
}
