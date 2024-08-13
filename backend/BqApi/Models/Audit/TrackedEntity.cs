namespace BqApi.Models.Audit
{
    public class TrackedEntity : ITrackedEntity
    {
        public int CreatedBy { get; set; }

        public void Update(int createdBy)
        {
            CreatedBy = createdBy;
        }
    }
}
