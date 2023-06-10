using Authentication.Api.Sockets.Hubs;

namespace Authentication.Api.Web.Start;

public static class ApplicationServer
{
	public static WebApplication Initialize(this WebApplication app)
	{
		// Allow CORS
		app.UseCors();

		app.UseOpenApi(settings =>
		{
			settings.PostProcess = (document, request) =>
			{
				if (!request.Headers.Referer.FirstOrDefault()?.StartsWith("https://") == true) return;

				foreach (var openApiServer in document.Servers) openApiServer.Url = openApiServer.Url.Replace("http://", "https://");
			};
		});
		app.UseSwaggerUi3();


		// Start Dependency Injection
		app.UseAdvancedDependencyInjection();

		// Setup authentication
		app.UseAuthentication();
		app.UseAuthorization();

		app.MapHub<UpdateHub>("/ws/update");

		// Setup Controllers
		app.MapControllers();

		if (!app.Environment.IsProduction()) return app;

		// Start SPA serving
		app.UseRouting();


		app.UseStaticFiles();

		app.MapWhen(ctx => !ctx.Request.Path.StartsWithSegments("/api"), appBuilder =>
		{
			appBuilder.UseRouting();
			appBuilder.UseEndpoints(ep => { ep.MapFallbackToFile("index.html"); });
		});

		return app;
	}
}