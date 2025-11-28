FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
ARG SERVICE_NAME
WORKDIR /src

# Copy project file
COPY ["src/${SERVICE_NAME}/${SERVICE_NAME}.csproj", "src/${SERVICE_NAME}/"]
RUN dotnet restore "src/${SERVICE_NAME}/${SERVICE_NAME}.csproj"

# Copy everything else and build
COPY . .
WORKDIR "/src/src/${SERVICE_NAME}"
RUN dotnet build "${SERVICE_NAME}.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "${SERVICE_NAME}.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "${SERVICE_NAME}.dll"]