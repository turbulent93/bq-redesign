using BeautyQueenApi.Data;
using MediatR;

namespace BeautyQueenApi.Requests.Tokens
{
    public class TokenRequest : IRequest<TokenDto> {
        public string Login { get; set; } = null!;
        public string? Password { get; set; } = null!;
        public int? PunchMapId { get; set; }
        public int? PromoId { get; set; }
    }
}