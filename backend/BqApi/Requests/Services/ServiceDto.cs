using BeautyQueenApi.Requests.Specializations;

namespace BeautyQueenApi.Requests.Services
{
    public class ServiceDto
    {
        public int? Id { get; set; }
        public string Name { get; set; } = null!;
        public int Price { get; set; }
        public int Duration { get; set; }
        public int SpecializationId { get; set; }
        public int CreatedBy { get; set; }

        public SpecializationDto? Specialization { get; set; }
    }
}
