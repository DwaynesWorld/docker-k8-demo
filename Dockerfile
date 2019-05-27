FROM microsoft/dotnet:2.2-aspnetcore-runtime AS base
WORKDIR /app
EXPOSE 80

FROM microsoft/dotnet:2.2-sdk AS build
WORKDIR /src
COPY ["demo.csproj", "./"]
RUN dotnet restore "./demo.csproj"
COPY . .
WORKDIR "/src/"
RUN dotnet build "demo.csproj" -c Release -o /app

FROM build AS publish
RUN dotnet publish "demo.csproj" -c Release -o /app

FROM base AS final
WORKDIR /app
COPY --from=publish /app .
ENTRYPOINT ["dotnet", "demo.dll"]
