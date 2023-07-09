using Authentication.Api.Abstractions.Interfaces.Injections;
using Authentication.Api.Abstractions.Transports.Data.config;
using Authentication.Api.Adapters.Injections;
using Authentication.Api.Core.Injections;
using Authentication.Api.Db.Injections;
using Authentication.Api.Web.Utils.Extensions;

namespace Authentication.Api.Web.Start;

public class AppBuilder
{
	public AppBuilder(string[] args)
	{
		var builder = WebApplication.CreateBuilder(args);

		builder.Configuration.AddJsonFile("appsettings.json", false, true);
		builder.Configuration.AddJsonFile("appsettings.docker.json", true, true);

		builder.Services.Configure<AppConfig>(builder.Configuration);
		builder.Services.AddModule<AdapterModule>(builder.Configuration);
		builder.Services.AddModule<CoreModule>(builder.Configuration);
		builder.Services.AddModule<DatabaseModule>(builder.Configuration);

		builder.Host.AddLogging();


		builder.Services
			.AddAppControllers()
			.AddAppSignalR()
			.AddAppSwagger()
			.AddAppOpenTelemetry(builder.Configuration);

		if (builder.Environment.IsDevelopment()) builder.Services.SetupDevelopmentCors();

		Application = builder.Build();
	}

	public WebApplication Application { get; }
}