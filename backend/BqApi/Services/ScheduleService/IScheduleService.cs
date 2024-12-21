using BeautyQueenApi.Requests.Appointments;
using BeautyQueenApi.Requests.Schedules;
using BqApi.Requests.Schedules;

namespace BqApi.Services.ScheduleService
{
    public interface IScheduleService
    {
        Task<List<SchedulePeriodDto>> GetAvailablePeriods(int scheduleId, int? excludedId);
        Task<List<ScheduleTimeDto>> GetAvailableTime(int scheduleId, int duration, TimeOnly? startAt = null, TimeOnly? endAt = null);
        //Task<int> GetAvailableTimeCount(int scheduleId, int duration);
        Task<string?> GetContent(string contentType, int? scheduleId, int? duration, TimeOnly? startAt = null, TimeOnly? endAt = null);
        Task<List<int>> Fill(FillScheduleRequest request);
    }
}
