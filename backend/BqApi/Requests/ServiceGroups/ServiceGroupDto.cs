using BeautyQueenApi.Requests.Services;
using BeautyQueenApi.Requests.Specializations;

namespace BeautyQueenApi.Requests.ServiceGroups
{
    public class ServiceGroupDto
    {
        public int? Id { get; set; }
        public string Name { get; set; } = null!;

        public List<ServiceDto>? Services { get; set; }
    }
}
