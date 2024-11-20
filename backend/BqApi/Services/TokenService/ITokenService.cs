using BeautyQueenApi.Models;
using BeautyQueenApi.Requests.Tokens;
using BqApi.Requests.Tokens;
using BqApi.Services.TokenService;
using System.Security.Claims;

namespace BeautyQueenApi.Services.TokenService
{
    public interface ITokenService
    {
        public Task<TokenDto> Login(TokenRequest request);
        public Task<TokenDto> Register(TokenRequest request);
        public Task<TokenDto> Refresh(TokenDto request);
        public Task<CheckResultDto> Check(TokenDto request);
        public string GetClaim(IEnumerable<Claim> claims, string claimType);
    }
}
