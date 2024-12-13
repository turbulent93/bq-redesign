using BeautyQueenApi.Requests.Specializations;
using BqApi.Models.Audit;
using System.ComponentModel.DataAnnotations;

namespace BeautyQueenApi.Models
{
    public class Specialization(string name)// : TrackedEntity
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; } = name;

        public List<User> Employees { get; set; } = null!;
        public List<Service> Services { get; set; } = null!;

        public void Update(CreateOrUpdateSpecializationRequest request)
        {
            Name = request.Name;
        }
    }
}
