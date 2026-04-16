using TourPlanner.BL.DTOs;
using TourPlanner.BL.HttpClients;
using TourPlanner.BL.Services.Interfaces;
using TourPlanner.DAL.Entities;
using TourPlanner.DAL.Repositories.Interfaces;
using log4net;

namespace TourPlanner.BL.Services;

public class TourService : ITourService
{
    private static readonly ILog Log = LogManager.GetLogger(typeof(TourService));
    private readonly ITourRepository _tourRepo;
    private readonly IOpenRouteServiceClient _orsClient;

    public TourService(ITourRepository tourRepo, IOpenRouteServiceClient orsClient)
    {
        _tourRepo = tourRepo;
        _orsClient = orsClient;
    }

    public async Task<IEnumerable<TourResponse>> GetToursAsync(Guid userId)
    {
        var tours = await _tourRepo.GetByUserIdAsync(userId);
        return tours.Select(MapToResponse);
    }

    public async Task<TourResponse?> GetTourByIdAsync(Guid tourId, Guid userId)
    {
        var tour = await _tourRepo.GetWithLogsAsync(tourId);
        if (tour == null || tour.UserId != userId) return null;
        return MapToResponse(tour);
    }

    public async Task<TourResponse> CreateTourAsync(CreateTourRequest request, Guid userId)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
            throw new ArgumentException("Tour name is required.");
        if (string.IsNullOrWhiteSpace(request.From) || string.IsNullOrWhiteSpace(request.To))
            throw new ArgumentException("From and To locations are required.");

        var tour = new Tour
        {
            Name = request.Name,
            Description = request.Description,
            From = request.From,
            To = request.To,
            TransportType = request.TransportType,
            UserId = userId
        };

        if (request.ImagePath != null)
            tour.RouteImagePath = request.ImagePath;

        await FetchRouteDataAsync(tour);
        await _tourRepo.AddAsync(tour);
        Log.Info($"Tour created: {tour.Name} (id={tour.Id})");
        return MapToResponse(tour);
    }

    public async Task<TourResponse> UpdateTourAsync(Guid tourId, UpdateTourRequest request, Guid userId)
    {
        var tour = await _tourRepo.GetByIdAsync(tourId)
            ?? throw new KeyNotFoundException("Tour not found.");
        if (tour.UserId != userId)
            throw new UnauthorizedAccessException("Access denied.");

        bool routeChanged = tour.From != request.From || tour.To != request.To || tour.TransportType != request.TransportType;
        tour.Name = request.Name;
        tour.Description = request.Description;
        tour.From = request.From;
        tour.To = request.To;
        tour.TransportType = request.TransportType;
        tour.UpdatedAt = DateTime.UtcNow;

        if (request.ImagePath != null)
            tour.RouteImagePath = request.ImagePath;

        if (routeChanged)
            await FetchRouteDataAsync(tour);

        await _tourRepo.UpdateAsync(tour);
        Log.Info($"Tour updated: {tour.Id}");
        return MapToResponse(tour);
    }

    public async Task DeleteTourAsync(Guid tourId, Guid userId)
    {
        var tour = await _tourRepo.GetByIdAsync(tourId)
            ?? throw new KeyNotFoundException("Tour not found.");
        if (tour.UserId != userId)
            throw new UnauthorizedAccessException("Access denied.");
        await _tourRepo.DeleteAsync(tourId);
        Log.Info($"Tour deleted: {tourId}");
    }

    private async Task FetchRouteDataAsync(Tour tour)
    {
        try
        {
            var fromCoords = await _orsClient.GeocodeAsync(tour.From);
            var toCoords = await _orsClient.GeocodeAsync(tour.To);
            if (fromCoords.HasValue && toCoords.HasValue)
            {
                var route = await _orsClient.GetDirectionsAsync(
                    fromCoords.Value.lon, fromCoords.Value.lat,
                    toCoords.Value.lon, toCoords.Value.lat,
                    tour.TransportType);
                if (route.HasValue)
                {
                    tour.Distance = route.Value.distance;
                    tour.EstimatedTime = route.Value.duration;
                }

                // Only set static map URL if user did not upload a custom image
                if (tour.RouteImagePath == null)
                {
                    double midLat = (fromCoords.Value.lat + toCoords.Value.lat) / 2.0;
                    double midLon = (fromCoords.Value.lon + toCoords.Value.lon) / 2.0;
                    tour.RouteImagePath = $"https://staticmap.openstreetmap.de/staticmap.php" +
                        $"?center={midLat:F4},{midLon:F4}&zoom=8&size=400x250" +
                        $"&markers={fromCoords.Value.lat:F4},{fromCoords.Value.lon:F4},red-pushpin" +
                        $"|{toCoords.Value.lat:F4},{toCoords.Value.lon:F4},green-pushpin";
                }
            }
        }
        catch (Exception ex)
        {
            Log.Warn($"Could not fetch route data: {ex.Message}");
        }
    }

    private static TourResponse MapToResponse(Tour tour)
    {
        var logs = tour.TourLogs?.ToList() ?? [];
        int popularity = logs.Count;
        string childFriendliness = logs.Count == 0 ? "Unknown" : ComputeChildFriendliness(logs);
        return new TourResponse(
            tour.Id, tour.Name, tour.Description, tour.From, tour.To,
            tour.TransportType.ToString(), tour.Distance, tour.EstimatedTime,
            tour.RouteImagePath, popularity, childFriendliness,
            tour.CreatedAt, tour.UpdatedAt);
    }

    private static string ComputeChildFriendliness(List<TourLog> logs) => "N/A";
}
