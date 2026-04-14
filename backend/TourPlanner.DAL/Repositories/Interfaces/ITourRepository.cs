using TourPlanner.DAL.Entities;

namespace TourPlanner.DAL.Repositories.Interfaces;

public interface ITourRepository : IRepository<Tour>
{
    Task<IEnumerable<Tour>> GetByUserIdAsync(Guid userId);
    Task<Tour?> GetWithLogsAsync(Guid tourId);
}
