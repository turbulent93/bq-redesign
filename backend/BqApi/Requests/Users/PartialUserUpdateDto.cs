namespace BqApi.Requests.Users
{
    public class PartialUserUpdateDto
    {
        public int Id { get; set; }
        public string? Phone { get; set; }
        public int? PunchMapId { get; set; }
        public int? PromoId { get; set; }
    }
}
