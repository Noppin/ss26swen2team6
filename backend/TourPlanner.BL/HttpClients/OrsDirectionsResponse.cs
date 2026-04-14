using System.Text.Json.Serialization;

namespace TourPlanner.BL.HttpClients;

public class OrsDirectionsResponse
{
    [JsonPropertyName("features")]
    public OrsDirectionFeature[]? Features { get; set; }
}

public class OrsDirectionFeature
{
    [JsonPropertyName("geometry")]
    public OrsDirectionGeometry? Geometry { get; set; }

    [JsonPropertyName("properties")]
    public OrsDirectionProperties? Properties { get; set; }
}

public class OrsDirectionGeometry
{
    [JsonPropertyName("coordinates")]
    public double[][]? Coordinates { get; set; }
}

public class OrsDirectionProperties
{
    [JsonPropertyName("summary")]
    public OrsDirectionSummary? Summary { get; set; }
}

public class OrsDirectionSummary
{
    [JsonPropertyName("distance")]
    public double Distance { get; set; }

    [JsonPropertyName("duration")]
    public double Duration { get; set; }
}
