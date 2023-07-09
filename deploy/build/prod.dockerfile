# Building back
FROM mcr.microsoft.com/dotnet/sdk:7.0 AS builder-back

# Optim cache for "dotnet restore" with only csproj files
COPY app/back/Authentication.Api.sln /app/

COPY app/back/*/*.csproj /app

WORKDIR /app/

RUN find *.csproj | find *.csproj | sed -e 's/.csproj//g' | sed -e 's/Authentication.Api.//g' | xargs mkdir -p
RUN find *.csproj | sed -r -e 's/((.+).csproj)/.\/\1 .\/\2/g' | sed -e 's/ .\/Authentication.Api./ /g'  | xargs -I % sh -c 'mv %'

RUN dotnet restore

COPY app/back /app
RUN dotnet publish -c Release -o out


# Building front
FROM  node:18 as builder-front

COPY app/front/package.json /front/
COPY app/front/yarn.lock /front/
RUN cd /front && yarn

COPY app/front /front/
RUN cd /front && yarn build


# Running
FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS production
WORKDIR /back
COPY --from=builder-back /app/out .

COPY --from=builder-front /front/build /back/wwwroot
ENV FRONT_PATH /back/wwwroot


ENTRYPOINT ["dotnet", "Authentication.Api.Web.dll"]

