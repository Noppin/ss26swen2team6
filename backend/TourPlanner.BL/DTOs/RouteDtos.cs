namespace TourPlanner.BL.DTOs;

public record RouteResponse(
    double Distance,
    int Duration,
    double[][]? Coordinates
);
