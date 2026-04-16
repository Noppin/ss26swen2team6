using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TourPlanner.BL.DTOs;
using TourPlanner.BL.Services.Interfaces;
using TourPlanner.DAL.Entities.Enums;

namespace TourPlanner.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ToursController : ControllerBase
{
    private readonly ITourService _tourService;
    private readonly IWebHostEnvironment _env;

    public ToursController(ITourService tourService, IWebHostEnvironment env)
    {
        _tourService = tourService;
        _env = env;
    }

    private Guid UserId => Guid.Parse(
        User.FindFirstValue(ClaimTypes.NameIdentifier)
        ?? User.FindFirstValue("sub")
        ?? throw new InvalidOperationException("User ID claim missing"));

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var tours = await _tourService.GetToursAsync(UserId);
        return Ok(tours);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var tour = await _tourService.GetTourByIdAsync(id, UserId);
        return tour == null ? NotFound() : Ok(tour);
    }

    [HttpPost]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> Create(
        [FromForm] string name,
        [FromForm] string description,
        [FromForm] string from,
        [FromForm] string to,
        [FromForm] TransportType transportType,
        IFormFile? image)
    {
        try
        {
            string? imagePath = await SaveImageAsync(image);
            var request = new CreateTourRequest(name, description, from, to, transportType, imagePath);
            var tour = await _tourService.CreateTourAsync(request, UserId);
            return CreatedAtAction(nameof(GetById), new { id = tour.Id }, tour);
        }
        catch (ArgumentException ex) { return BadRequest(new { message = ex.Message }); }
    }

    [HttpPut("{id:guid}")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> Update(
        Guid id,
        [FromForm] string name,
        [FromForm] string description,
        [FromForm] string from,
        [FromForm] string to,
        [FromForm] TransportType transportType,
        IFormFile? image)
    {
        try
        {
            string? imagePath = await SaveImageAsync(image);
            var request = new UpdateTourRequest(name, description, from, to, transportType, imagePath);
            var tour = await _tourService.UpdateTourAsync(id, request, UserId);
            return Ok(tour);
        }
        catch (KeyNotFoundException) { return NotFound(); }
        catch (UnauthorizedAccessException) { return Forbid(); }
        catch (ArgumentException ex) { return BadRequest(new { message = ex.Message }); }
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        try
        {
            await _tourService.DeleteTourAsync(id, UserId);
            return NoContent();
        }
        catch (KeyNotFoundException) { return NotFound(); }
        catch (UnauthorizedAccessException) { return Forbid(); }
    }

    private async Task<string?> SaveImageAsync(IFormFile? image)
    {
        if (image == null || image.Length == 0) return null;

        var uploadsDir = Path.Combine(_env.ContentRootPath, "uploads");
        Directory.CreateDirectory(uploadsDir);

        var ext = Path.GetExtension(image.FileName).ToLowerInvariant();
        var fileName = $"{Guid.NewGuid()}{ext}";
        var filePath = Path.Combine(uploadsDir, fileName);

        await using var stream = new FileStream(filePath, FileMode.Create);
        await image.CopyToAsync(stream);

        return $"/images/{fileName}";
    }
}
