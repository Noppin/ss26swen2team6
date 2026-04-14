using System.Text.Json.Serialization;

namespace TourPlanner.BL.HttpClients;

public class OrsGeocodingResponse
{
    [JsonPropertyName("features")]
    public OrsFeature[]? Features { get; set; }
}

public class OrsFeature
{
    [JsonPropertyName("geometry")]
    public OrsGeometry? Geometry { get; set; }
}

public class OrsGeometry
{
    [JsonPropertyName("coordinates")]
    public double[]? Coordinates { get; set; }
}
