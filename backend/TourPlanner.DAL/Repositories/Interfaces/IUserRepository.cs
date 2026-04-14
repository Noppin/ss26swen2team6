using TourPlanner.DAL.Entities;

namespace TourPlanner.DAL.Repositories.Interfaces;

public interface IUserRepository : IRepository<User>
{
    Task<User?> GetByEmailAsync(string email);
    Task<User?> GetByUsernameAsync(string username);
}
