FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
ARG SERVICE_NAME
WORKDIR /src

# Copy solution and project files first for better caching
COPY ["NuGet.config", "."]
COPY ["Directory.Build.props", "."]
COPY ["src/${SERVICE_NAME}/${SERVICE_NAME}.csproj", "src/${SERVICE_NAME}/"]
COPY ["src/Shared/Shared.csproj", "src/Shared/"]

# Restore dependencies
RUN dotnet restore "src/${SERVICE_NAME}/${SERVICE_NAME}.csproj" --runtime linux-x64

# Copy everything else
COPY . .

# Build and publish in single stage
WORKDIR "/src/src/${SERVICE_NAME}"
RUN dotnet publish "${SERVICE_NAME}.csproj" \
    -c Release \
    -o /app/publish \
    --runtime linux-x64 \
    --self-contained false \
    --no-restore

# Runtime image
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .

# Use direct dotnet command for better performance
ENTRYPOINT ["dotnet", "GatewayService.dll"]