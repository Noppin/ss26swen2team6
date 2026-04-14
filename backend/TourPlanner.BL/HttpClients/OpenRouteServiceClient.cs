using System.Net.Http.Json;
using Microsoft.Extensions.Options;
using TourPlanner.DAL.Entities.Enums;
using log4net;

namespace TourPlanner.BL.HttpClients;

public interface IOpenRouteServiceClient
{
    Task<(double lon, double lat)?> GeocodeAsync(string place);
    Task<(double distance, int duration, double[][]? coordinates)?> GetDirectionsAsync(
        double fromLon, double fromLat, double toLon, double toLat, TransportType transportType);
}

public class OpenRouteServiceClient : IOpenRouteServiceClient
{
    private static readonly ILog Log = LogManager.GetLogger(typeof(OpenRouteServiceClient));
    private readonly HttpClient _httpClient;
    private readonly OrsOptions _options;

    private static string GetProfile(TransportType type) => type switch
    {
        TransportType.Bike => "cycling-regular",
        TransportType.Hike => "foot-hiking",
        TransportType.Running => "foot-walking",
        TransportType.Vacation => "driving-car",
        _ => "driving-car"
    };

    public OpenRouteServiceClient(HttpClient httpClient, IOptions<OrsOptions> options)
    {
        _httpClient = httpClient;
        _options = options.Value;
        _httpClient.BaseAddress = new Uri(_options.BaseUrl);
        _httpClient.Timeout = TimeSpan.FromSeconds(15);
        _httpClient.DefaultRequestHeaders.Authorization =
            new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _options.ApiKey);
    }

    public async Task<(double lon, double lat)?> GeocodeAsync(string place)
    {
        try
        {
            var url = $"/geocode/search?api_key={_options.ApiKey}&text={Uri.EscapeDataString(place)}&size=1";
            var response = await _httpClient.GetFromJsonAsync<OrsGeocodingResponse>(url);
            var coords = response?.Features?.FirstOrDefault()?.Geometry?.Coordinates;
            if (coords is { Length: >= 2 })
                return (coords[0], coords[1]);
        }
        catch (Exception ex)
        {
            Log.Warn($"Geocoding failed for '{place}': {ex.Message}");
        }
        return null;
    }

    public async Task<(double distance, int duration, double[][]? coordinates)?> GetDirectionsAsync(
        double fromLon, double fromLat, double toLon, double toLat, TransportType transportType)
    {
        try
        {
            var profile = GetProfile(transportType);
            var inv = System.Globalization.CultureInfo.InvariantCulture;
            var url = $"/v2/directions/{profile}?api_key={_options.ApiKey}" +
                      $"&start={fromLon.ToString(inv)},{fromLat.ToString(inv)}" +
                      $"&end={toLon.ToString(inv)},{toLat.ToString(inv)}";
            var response = await _httpClient.GetFromJsonAsync<OrsDirectionsResponse>(url);
            var feature = response?.Features?.FirstOrDefault();
            if (feature?.Properties?.Summary != null)
            {
                return (
                    Math.Round(feature.Properties.Summary.Distance / 1000, 2),
                    (int)(feature.Properties.Summary.Duration / 60),
                    feature.Geometry?.Coordinates
                );
            }
        }
        catch (Exception ex)
        {
            Log.Error($"ORS directions request failed: {ex.Message}");
        }
        return null;
    }
}
