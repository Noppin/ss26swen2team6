using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TourPlanner.BL.Services.Interfaces;
using TourPlanner.DAL.Entities.Enums;

namespace TourPlanner.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class RouteController : ControllerBase
{
    private readonly IRouteService _routeService;

    public RouteController(IRouteService routeService) => _routeService = routeService;

    [HttpGet]
    public async Task<IActionResult> GetRoute(
        [FromQuery] string from,
        [FromQuery] string to,
        [FromQuery] TransportType type = TransportType.Bike)
    {
        if (string.IsNullOrWhiteSpace(from) || string.IsNullOrWhiteSpace(to))
            return BadRequest(new { message = "from and to are required." });
        var route = await _routeService.GetRouteAsync(from, to, type);
        return route == null ? NotFound(new { message = "Route not found." }) : Ok(route);
    }
}
