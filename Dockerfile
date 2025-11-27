FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
ARG SERVICE_NAME

# Copy solution file first
COPY *.sln ./

# Create directories and copy project files
RUN mkdir -p src/SearchService && \
    mkdir -p src/AuthorService && \
    mkdir -p src/CategoryService && \
    mkdir -p src/GatewayService && \
    mkdir -p src/BooksService

COPY src/SearchService/*.csproj src/SearchService/
COPY src/AuthorService/*.csproj src/AuthorService/
COPY src/CategoryService/*.csproj src/CategoryService/
COPY src/GatewayService/*.csproj src/GatewayService/
COPY src/BooksService/*.csproj src/BooksService/

# Restore packages
RUN dotnet restore spst-library.sln

# Copy everything else
COPY . .

# Build specific service - explicitne zadáme cestu k projektu
WORKDIR /src
RUN dotnet publish ./src/${SERVICE_NAME}/${SERVICE_NAME}.csproj -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "${SERVICE_NAME}.dll"]