using TourPlanner.BL.DTOs;

namespace TourPlanner.BL.Services.Interfaces;

public interface ITourService
{
    Task<IEnumerable<TourResponse>> GetToursAsync(Guid userId);
    Task<TourResponse?> GetTourByIdAsync(Guid tourId, Guid userId);
    Task<TourResponse> CreateTourAsync(CreateTourRequest request, Guid userId);
    Task<TourResponse> UpdateTourAsync(Guid tourId, UpdateTourRequest request, Guid userId);
    Task DeleteTourAsync(Guid tourId, Guid userId);
}
