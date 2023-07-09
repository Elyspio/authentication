using Authentication.Api.Web.Filters;
using Microsoft.AspNetCore.Mvc.Formatters;
using Microsoft.Extensions.DependencyInjection.Extensions;
using System.Text.Json.Serialization;

namespace Authentication.Api.Web.Utils.Extensions;

public static class ApiExtentions
{
	/// <summary>
	///     Setup Controllers configuration
	/// </summary>
	/// <param name="services"></param>
	/// <returns></returns>
	public static IServiceCollection AddAppControllers(this IServiceCollection services)
	{
		services.AddEndpointsApiExplorer();


		services.TryAddSingleton<IHttpContextAccessor, HttpContextAccessor>();

		services.ConfigureHttpJsonOptions(options => options.SerializerOptions.Converters.Add(new JsonStringEnumConverter()));

		services.AddControllers(o =>
				{
					o.Conventions.Add(new ControllerDocumentationConvention());
					o.OutputFormatters.RemoveType<StringOutputFormatter>();
					o.Filters.Add<HttpExceptionFilter>();
				}
			)
			.AddJsonOptions(x =>
			{
				// serialize enums as strings in api responses (e.g. Role)
				x.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter(allowIntegerValues: false));

				// ignore omitted parameters on models to enable optional params (e.g. User update)
				x.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
			});

		return services;
	}

	/// <summary>
	///     Setup SignalR configuration
	/// </summary>
	/// <param name="services"></param>
	/// <returns></returns>
	public static IServiceCollection AddAppSignalR(this IServiceCollection services)
	{
		services.AddSignalR(options => { options.EnableDetailedErrors = true; })
			.AddJsonProtocol(options =>
				{
					options.PayloadSerializerOptions.IncludeFields = true;
					options.PayloadSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
					options.PayloadSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
					options.PayloadSerializerOptions.Converters.Add(new JsonStringEnumConverter());
				}
			);

		return services;
	}

	/// <summary>
	///     Setup CORS for local development
	/// </summary>
	/// <param name="services"></param>
	/// <returns></returns>
	public static IServiceCollection SetupDevelopmentCors(this IServiceCollection services)
	{
		services.AddCors(options =>
			{
				options.AddDefaultPolicy(b =>
					{
						b.AllowAnyOrigin();
						b.AllowAnyHeader();
						b.AllowAnyMethod();
					}
				);
			}
		);

		return services;
	}
}