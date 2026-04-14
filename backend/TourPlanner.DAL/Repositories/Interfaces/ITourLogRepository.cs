using TourPlanner.DAL.Entities;

namespace TourPlanner.DAL.Repositories.Interfaces;

public interface ITourLogRepository : IRepository<TourLog>
{
    Task<IEnumerable<TourLog>> GetByTourIdAsync(Guid tourId);
}
