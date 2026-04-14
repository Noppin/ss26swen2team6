using TourPlanner.BL.DTOs;
using TourPlanner.DAL.Entities.Enums;

namespace TourPlanner.BL.Services.Interfaces;

public interface IRouteService
{
    Task<RouteResponse?> GetRouteAsync(string from, string to, TransportType transportType);
}
