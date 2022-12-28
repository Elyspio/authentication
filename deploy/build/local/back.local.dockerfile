FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build

ARG SLN_PATH=app/back/Authentication.Api.sln
ARG MAIN_CSPROJ_PATH=app/back/Web/
ARG ROOT_FOLDER=app/back/


COPY app/back /app

WORKDIR /app/Web

RUN dotnet restore Authentication.Api.Web.csproj


CMD ["dotnet", "watch",  "--project", "Authentication.Api.Web.csproj"]

