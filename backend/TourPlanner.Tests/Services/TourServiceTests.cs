using Moq;
using NUnit.Framework;
using TourPlanner.BL.DTOs;
using TourPlanner.BL.HttpClients;
using TourPlanner.BL.Services;
using TourPlanner.DAL.Entities;
using TourPlanner.DAL.Entities.Enums;
using TourPlanner.DAL.Repositories.Interfaces;

namespace TourPlanner.Tests.Services;

[TestFixture]
public class TourServiceTests
{
    private Mock<ITourRepository> _tourRepoMock = null!;
    private Mock<IOpenRouteServiceClient> _orsMock = null!;
    private TourService _tourService = null!;
    private Guid _userId;

    [SetUp]
    public void SetUp()
    {
        _tourRepoMock = new Mock<ITourRepository>();
        _orsMock = new Mock<IOpenRouteServiceClient>();
        _tourService = new TourService(_tourRepoMock.Object, _orsMock.Object);
        _userId = Guid.NewGuid();

        _orsMock.Setup(o => o.GeocodeAsync(It.IsAny<string>()))
            .ReturnsAsync((14.3, 48.3));
        _orsMock.Setup(o => o.GetDirectionsAsync(
                It.IsAny<double>(), It.IsAny<double>(),
                It.IsAny<double>(), It.IsAny<double>(),
                It.IsAny<TransportType>()))
            .ReturnsAsync((10.5, 45, (double[][]?)null));
    }

    [Test]
    public async Task CreateTour_WithValidData_ReturnsTourResponse()
    {
        _tourRepoMock.Setup(r => r.AddAsync(It.IsAny<Tour>())).ReturnsAsync((Tour t) => t);
        var request = new CreateTourRequest("Hiking Trail", "Nice hike", "Vienna", "Salzburg", TransportType.Hike);

        var result = await _tourService.CreateTourAsync(request, _userId);

        Assert.That(result, Is.Not.Null);
        Assert.That(result.Name, Is.EqualTo("Hiking Trail"));
        Assert.That(result.Distance, Is.EqualTo(10.5));
        _tourRepoMock.Verify(r => r.AddAsync(It.IsAny<Tour>()), Times.Once);
    }

    [Test]
    public void CreateTour_WithEmptyName_ThrowsArgumentException()
    {
        var request = new CreateTourRequest("", "desc", "Vienna", "Salzburg", TransportType.Bike);
        Assert.ThrowsAsync<ArgumentException>(() => _tourService.CreateTourAsync(request, _userId));
    }

    [Test]
    public async Task UpdateTour_ByOwner_ReturnsUpdatedTour()
    {
        var existingTour = new Tour
        {
            Id = Guid.NewGuid(), Name = "Old", Description = "",
            From = "A", To = "B", TransportType = TransportType.Bike,
            UserId = _userId, TourLogs = []
        };
        _tourRepoMock.Setup(r => r.GetByIdAsync(existingTour.Id)).ReturnsAsync(existingTour);
        _tourRepoMock.Setup(r => r.UpdateAsync(It.IsAny<Tour>())).Returns(Task.CompletedTask);

        var result = await _tourService.UpdateTourAsync(
            existingTour.Id,
            new UpdateTourRequest("New Name", "desc", "A", "B", TransportType.Bike),
            _userId);

        Assert.That(result.Name, Is.EqualTo("New Name"));
    }

    [Test]
    public void UpdateTour_ByNonOwner_ThrowsUnauthorizedException()
    {
        var tour = new Tour { Id = Guid.NewGuid(), UserId = Guid.NewGuid() };
        _tourRepoMock.Setup(r => r.GetByIdAsync(tour.Id)).ReturnsAsync(tour);

        Assert.ThrowsAsync<UnauthorizedAccessException>(() =>
            _tourService.UpdateTourAsync(tour.Id,
                new UpdateTourRequest("n", "d", "a", "b", TransportType.Bike), _userId));
    }

    [Test]
    public void DeleteTour_ByNonOwner_ThrowsUnauthorizedException()
    {
        var tour = new Tour { Id = Guid.NewGuid(), UserId = Guid.NewGuid() };
        _tourRepoMock.Setup(r => r.GetByIdAsync(tour.Id)).ReturnsAsync(tour);

        Assert.ThrowsAsync<UnauthorizedAccessException>(() =>
            _tourService.DeleteTourAsync(tour.Id, _userId));
    }

    [Test]
    public async Task DeleteTour_ByOwner_CallsRepoDelete()
    {
        var tourId = Guid.NewGuid();
        var tour = new Tour { Id = tourId, UserId = _userId };
        _tourRepoMock.Setup(r => r.GetByIdAsync(tourId)).ReturnsAsync(tour);
        _tourRepoMock.Setup(r => r.DeleteAsync(tourId)).Returns(Task.CompletedTask);

        await _tourService.DeleteTourAsync(tourId, _userId);

        _tourRepoMock.Verify(r => r.DeleteAsync(tourId), Times.Once);
    }

    [Test]
    public async Task GetTours_ReturnsUserTours()
    {
        var tours = new List<Tour>
        {
            new() { Id = Guid.NewGuid(), Name = "Tour A", UserId = _userId, TourLogs = [] },
            new() { Id = Guid.NewGuid(), Name = "Tour B", UserId = _userId, TourLogs = [] }
        };
        _tourRepoMock.Setup(r => r.GetByUserIdAsync(_userId)).ReturnsAsync(tours);

        var result = (await _tourService.GetToursAsync(_userId)).ToList();

        Assert.That(result.Count, Is.EqualTo(2));
    }

}
