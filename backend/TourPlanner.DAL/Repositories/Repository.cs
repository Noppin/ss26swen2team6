using Microsoft.EntityFrameworkCore;
using TourPlanner.DAL.Context;
using TourPlanner.DAL.Repositories.Interfaces;

namespace TourPlanner.DAL.Repositories;

public class Repository<T> : IRepository<T> where T : class
{
    protected readonly TourPlannerDbContext _context;
    protected readonly DbSet<T> _dbSet;

    public Repository(TourPlannerDbContext context)
    {
        _context = context;
        _dbSet = context.Set<T>();
    }

    public virtual async Task<T?> GetByIdAsync(Guid id)
        => await _dbSet.FindAsync(id);

    public virtual async Task<IEnumerable<T>> GetAllAsync()
        => await _dbSet.ToListAsync();

    public virtual async Task<T> AddAsync(T entity)
    {
        await _dbSet.AddAsync(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    public virtual async Task UpdateAsync(T entity)
    {
        _dbSet.Update(entity);
        await _context.SaveChangesAsync();
    }

    public virtual async Task DeleteAsync(Guid id)
    {
        var entity = await GetByIdAsync(id);
        if (entity != null)
        {
            _dbSet.Remove(entity);
            await _context.SaveChangesAsync();
        }
    }
}
