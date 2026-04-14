using TourPlanner.BL.DTOs;
using TourPlanner.BL.HttpClients;
using TourPlanner.BL.Services.Interfaces;
using TourPlanner.DAL.Entities.Enums;
using log4net;

namespace TourPlanner.BL.Services;

public class RouteService : IRouteService
{
    private static readonly ILog Log = LogManager.GetLogger(typeof(RouteService));
    private readonly IOpenRouteServiceClient _orsClient;

    public RouteService(IOpenRouteServiceClient orsClient) => _orsClient = orsClient;

    public async Task<RouteResponse?> GetRouteAsync(string from, string to, TransportType transportType)
    {
        var fromCoords = await _orsClient.GeocodeAsync(from);
        var toCoords = await _orsClient.GeocodeAsync(to);
        if (!fromCoords.HasValue || !toCoords.HasValue)
        {
            Log.Warn($"Geocoding failed for '{from}' or '{to}'");
            return null;
        }
        var directions = await _orsClient.GetDirectionsAsync(
            fromCoords.Value.lon, fromCoords.Value.lat,
            toCoords.Value.lon, toCoords.Value.lat,
            transportType);
        if (!directions.HasValue)
        {
            Log.Warn("Directions fetch failed.");
            return null;
        }
        return new RouteResponse(directions.Value.distance, directions.Value.duration, directions.Value.coordinates);
    }
}
