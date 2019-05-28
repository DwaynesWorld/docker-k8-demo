FROM microsoft/dotnet:2.2-aspnetcore-runtime AS base
WORKDIR /app
EXPOSE 81

FROM microsoft/dotnet:2.2-sdk AS build
WORKDIR /src
COPY ["backend.csproj", "./"]
RUN dotnet restore "./backend.csproj"
COPY . .
WORKDIR /src/
RUN dotnet build "backend.csproj" -c Release -o /app

FROM build AS publish
RUN dotnet publish "backend.csproj" -c Release -o /app

FROM base AS final
WORKDIR /app
COPY --from=publish /app .
ENV ASPNETCORE_URLS=http://+:81
ENTRYPOINT ["dotnet", "backend.dll"]
