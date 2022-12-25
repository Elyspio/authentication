namespace Authentication.Api.Web.Server;

public static class ApplicationServer
{
	public static WebApplication Initialize(this WebApplication application)
	{
		// Allow CORS
		application.UseCors();

		application.UseOpenApi();
		application.UseSwaggerUi3();

		// Start Dependency Injection
		application.UseAdvancedDependencyInjection();

		// Setup Controllers
		application.MapControllers();

		application.UseAuthentication();

		if (!application.Environment.IsProduction()) return application;

		// Start SPA serving
		application.UseRouting();

		application.UseDefaultFiles(new DefaultFilesOptions
			{
				DefaultFileNames = new List<string>
				{
					"index.html"
				},
				RedirectToAppendTrailingSlash = true
			}
		);
		application.UseStaticFiles();

		application.UseEndpoints(endpoints => { endpoints.MapFallbackToFile("/index.html"); });

		return application;
	}
}