using Authentication.Api.Abstractions.Technical;
using Authentication.Api.Web.Utils.Helpers;
using OpenTelemetry.Exporter;
using OpenTelemetry.Metrics;
using OpenTelemetry.Resources;
using OpenTelemetry.Trace;

namespace Authentication.Api.Web.Utils.Extensions;

public static class OpenTelemetryExtentions
{
	public static IServiceCollection AddAppOpenTelemetry(this IServiceCollection services, IConfiguration configuration)
	{
		services.AddOptions<OtlpExporterOptions>().Configure(opts => { opts.Endpoint = new(configuration["OpenTelemetry:Url"]); });

		var sources = AssemblyHelper.GetClassWithInterface<Program, TracingContext>().ToArray();

		services.AddOpenTelemetry()
			.ConfigureResource(conf => conf.AddService("authentication"))
			.WithTracing(tracingBuilder =>
			{
				tracingBuilder
					.AddSource(sources)
					// Configure exporters
					.AddOtlpExporter()
					// Configure adapters
					.AddAspNetCoreInstrumentation()
					.AddHttpClientInstrumentation()
					.AddMongoDBInstrumentation(); // Adds MongoDB OTel support
			}).WithMetrics(metricBuilder =>
			{
				metricBuilder
					.AddMeter(sources)
					.AddOtlpExporter()
					.AddHttpClientInstrumentation()
					.AddAspNetCoreInstrumentation();
			});

		return services;
	}
}