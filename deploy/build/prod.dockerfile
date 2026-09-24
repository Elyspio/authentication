# Building back
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS builder-back

# Optim cache for "dotnet restore" with only csproj files
COPY app/back/Authentication.Api.slnx /app/

COPY app/back/*/*.csproj /app

WORKDIR /app/

RUN find *.csproj | find *.csproj | sed -e 's/.csproj//g' | sed -e 's/Authentication.Api.//g' | xargs mkdir -p
RUN find *.csproj | sed -r -e 's/((.+).csproj)/.\/\1 .\/\2/g' | sed -e 's/ .\/Authentication.Api./ /g'  | xargs -I % sh -c 'mv %'

RUN dotnet restore

COPY app/back /app
RUN dotnet publish Web/Authentication.Api.Web.csproj -c Release -o out


# Building front
FROM node:26 AS builder-front

ARG PNPM_VERSION=12.5.1
RUN npm install -g pnpm@$PNPM_VERSION

COPY app/front/package.json app/front/pnpm-lock.yaml app/front/pnpm-workspace.yaml /front/
RUN cd /front && pnpm install --frozen-lockfile

COPY app/front /front/
RUN cd /front && pnpm build


# Running
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS production
WORKDIR /back
# .NET 8+ images listen on 8080 by default: keep port 80 (traefik loadbalancer.server.port)
ENV ASPNETCORE_HTTP_PORTS=80
COPY --from=builder-back /app/out .

COPY --from=builder-front /front/build /back/wwwroot
ENV FRONT_PATH=/back/wwwroot


ENTRYPOINT ["dotnet", "Authentication.Api.Web.dll"]

