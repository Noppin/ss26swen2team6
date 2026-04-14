using Microsoft.EntityFrameworkCore;
using TourPlanner.DAL.Context;
using TourPlanner.DAL.Entities;
using TourPlanner.DAL.Repositories.Interfaces;

namespace TourPlanner.DAL.Repositories;

public class TourRepository : Repository<Tour>, ITourRepository
{
    public TourRepository(TourPlannerDbContext context) : base(context) { }

    public async Task<IEnumerable<Tour>> GetByUserIdAsync(Guid userId)
        => await _context.Tours
            .Include(t => t.TourLogs)
            .Where(t => t.UserId == userId)
            .OrderByDescending(t => t.CreatedAt)
            .ToListAsync();

    public async Task<Tour?> GetWithLogsAsync(Guid tourId)
        => await _context.Tours
            .Include(t => t.TourLogs)
            .FirstOrDefaultAsync(t => t.Id == tourId);
}
