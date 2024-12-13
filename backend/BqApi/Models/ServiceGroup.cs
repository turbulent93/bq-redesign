using System.ComponentModel.DataAnnotations;
using BeautyQueenApi.Requests.ServiceGroups;
using BqApi.Models.Audit;

namespace BeautyQueenApi.Models
{
    public class ServiceGroup(string name)// : TrackedEntity
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; } = name;

        public List<Service>? Services { get; set; }

        public void Update(ServiceGroupDto request) {
            Name = request.Name;
        }
    }
}
