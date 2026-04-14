FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY TourPlanner.sln .
COPY TourPlanner.API/TourPlanner.API.csproj TourPlanner.API/
COPY TourPlanner.BL/TourPlanner.BL.csproj TourPlanner.BL/
COPY TourPlanner.DAL/TourPlanner.DAL.csproj TourPlanner.DAL/
COPY TourPlanner.Tests/TourPlanner.Tests.csproj TourPlanner.Tests/

RUN dotnet restore

COPY . .

RUN dotnet publish TourPlanner.API/TourPlanner.API.csproj -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080
ENTRYPOINT ["dotnet", "TourPlanner.API.dll"]
