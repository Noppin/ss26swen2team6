using Microsoft.EntityFrameworkCore;
using TourPlanner.DAL.Context;
using TourPlanner.DAL.Entities;
using TourPlanner.DAL.Repositories.Interfaces;

namespace TourPlanner.DAL.Repositories;

public class TourLogRepository : Repository<TourLog>, ITourLogRepository
{
    public TourLogRepository(TourPlannerDbContext context) : base(context) { }

    public async Task<IEnumerable<TourLog>> GetByTourIdAsync(Guid tourId)
        => await _context.TourLogs
            .Where(l => l.TourId == tourId)
            .OrderByDescending(l => l.DateTime)
            .ToListAsync();
}
