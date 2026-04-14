namespace TourPlanner.BL.DTOs;

public record CreateTourLogRequest(
    DateTime DateTime,
    string Comment,
    int Difficulty,
    double TotalDistance,
    int TotalTime,
    int Rating
);

public record UpdateTourLogRequest(
    DateTime DateTime,
    string Comment,
    int Difficulty,
    double TotalDistance,
    int TotalTime,
    int Rating
);

public record TourLogResponse(
    Guid Id,
    Guid TourId,
    DateTime DateTime,
    string Comment,
    int Difficulty,
    double TotalDistance,
    int TotalTime,
    int Rating,
    DateTime CreatedAt
);
