using BeautyQueenApi.Requests.Appointments;
using BeautyQueenApi.Requests.Schedules;

namespace BqApi.Services.ScheduleService
{
    public interface IScheduleService
    {
        Task<List<ScheduleTimeDto>> GetAvailableTime(int shceduleId, int duration, TimeOnly? startAt = null);
        //Task<int> GetAvailableTimeCount(int scheduleId, int duration);
        Task<string?> GetContent(string contentType, int? scheduleId, int? duration);
        Task<List<int>> Fill(FillScheduleRequest request);
    }
}
