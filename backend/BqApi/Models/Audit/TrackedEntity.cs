namespace BqApi.Models.Audit
{
    public class TrackedEntity : ITrackedEntity
    {
        //public int CreatedBy { get; set; }

        //public void Update(int createdBy)
        //{
        //    CreatedBy = createdBy;
        //}        
        public DateTime? CreatedAt { get; set; }

        public void Update(DateTime createdAt)
        {
            CreatedAt = createdAt;
        }
    }
}
