FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY ["anime_backend.csproj", "."]
RUN dotnet restore

COPY . .
RUN dotnet publish -c Release -o /App/out

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /App
COPY --from=build /App/out .
ENTRYPOINT ["dotnet", "anime_backend.dll"]