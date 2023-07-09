using Authentication.Api.Web.Utils.Filters.Swagger;

namespace Authentication.Api.Web.Utils.Extensions;

public static class SwaggerExtentions
{
	/// <summary>
	///     Active le versionning dans la génération de la documentation Swagger
	/// </summary>
	/// <param name="services"></param>
	/// <returns></returns>
	public static IServiceCollection AddAppSwagger(this IServiceCollection services)
	{
		services.AddEndpointsApiExplorer();

		var xmlPaths = Directory.GetFiles(AppContext.BaseDirectory).ToList().Where(f => f.EndsWith(".xml"));

		services.AddSwaggerGen(options =>
		{
			options.SupportNonNullableReferenceTypes();
			options.OperationFilter<SwaggerSetNullableOperationFilter>();
			options.OperationFilter<SwaggerRemoveVersionFilter>();
			options.SchemaFilter<NullableSchemaFilter>();

			options.UseAllOfToExtendReferenceSchemas();
			options.UseAllOfForInheritance();
			options.CustomOperationIds(e => e.ActionDescriptor.RouteValues["action"]);

			foreach (var xmlPath in xmlPaths) options.IncludeXmlComments(xmlPath);
		});

		return services;
	}

	/// <summary>
	///     Active la gestion de swagger et son interface en gérant le versioning
	/// </summary>
	/// <param name="app"></param>
	/// <returns></returns>
	public static WebApplication UseAppSwagger(this WebApplication app)
	{
		app.UseSwagger(options =>
		{
			options.PreSerializeFilters.Add((document, request) =>
			{
				if (!request.Headers.Referer.FirstOrDefault()?.StartsWith("https://") == true) return;

				foreach (var openApiServer in document.Servers) openApiServer.Url = openApiServer.Url.Replace("http://", "https://");
			});
		});
		app.UseSwaggerUI();

		return app;
	}
}