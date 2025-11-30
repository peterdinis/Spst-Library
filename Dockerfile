# Use a more specific SDK image for better caching
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
ARG SERVICE_NAME
WORKDIR /src

# Copy project files first for better layer caching
COPY ["NuGet.config", "."]
COPY ["Directory.Build.props", "."]
COPY ["src/Shared/Shared.csproj", "src/Shared/"]
COPY ["src/${SERVICE_NAME}/${SERVICE_NAME}.csproj", "src/${SERVICE_NAME}/"]

# Restore with optimizations
RUN --mount=type=cache,id=nuget,target=/root/.nuget/packages \
    dotnet restore "src/${SERVICE_NAME}/${SERVICE_NAME}.csproj" \
    --runtime linux-x64 \
    --verbosity quiet

# Copy source code
COPY . .

# Build with optimizations
WORKDIR "/src/src/${SERVICE_NAME}"
RUN --mount=type=cache,id=build,target=/root/.nuget/packages \
    dotnet build "${SERVICE_NAME}.csproj" \
    -c Release \
    --runtime linux-x64 \
    --no-restore \
    /p:SkipUndeclaredSources=true

# Publish with optimizations
RUN dotnet publish "${SERVICE_NAME}.csproj" \
    -c Release \
    -o /app/publish \
    --runtime linux-x64 \
    --self-contained false \
    --no-build \
    --no-restore \
    /p:DebugType=None \
    /p:DebugSymbols=false \
    /p:Optimize=true

# Runtime image
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app

# Add healthcheck tool
RUN apt-get update && apt-get install -y wget && rm -rf /var/lib/apt/lists/*

COPY --from=build /app/publish .

# Use non-root user for security
RUN groupadd -r appuser && useradd -r -g appuser appuser \
    && chown -R appuser:appuser /app
USER appuser

ENTRYPOINT ["dotnet", "GatewayService.dll"]