using TourPlanner.BL.DTOs;

namespace TourPlanner.BL.Services.Interfaces;

public interface ITourLogService
{
    Task<IEnumerable<TourLogResponse>> GetLogsAsync(Guid tourId, Guid userId);
    Task<TourLogResponse> CreateLogAsync(Guid tourId, CreateTourLogRequest request, Guid userId);
    Task<TourLogResponse> UpdateLogAsync(Guid tourId, Guid logId, UpdateTourLogRequest request, Guid userId);
    Task DeleteLogAsync(Guid tourId, Guid logId, Guid userId);
}
