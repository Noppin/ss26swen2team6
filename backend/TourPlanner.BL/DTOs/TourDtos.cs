using TourPlanner.DAL.Entities.Enums;

namespace TourPlanner.BL.DTOs;

public record CreateTourRequest(
    string Name,
    string Description,
    string From,
    string To,
    TransportType TransportType
);

public record UpdateTourRequest(
    string Name,
    string Description,
    string From,
    string To,
    TransportType TransportType
);

public record TourResponse(
    Guid Id,
    string Name,
    string Description,
    string From,
    string To,
    string TransportType,
    double Distance,
    int EstimatedTime,
    string? RouteImagePath,
    int Popularity,
    string ChildFriendliness,
    DateTime CreatedAt,
    DateTime UpdatedAt
);
