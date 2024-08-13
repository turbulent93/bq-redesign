namespace BqApi.Models.Audit
{
    public interface ITrackedEntity
    {
        public int CreatedBy { get; set; }

        public void Update(int createdBy);
    }
}