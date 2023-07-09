using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace Authentication.Api.Web.Utils.Filters.Swagger;

/// <summary>
///     Supprime le parametre "api-version" qui est automatiquement ajouter par le framework
/// </summary>
public class SwaggerRemoveVersionFilter : IOperationFilter
{
	/// <summary>
	///     Ajout dans la documentation Swagger le header x-token-claims-idTechPs
	/// </summary>
	/// <param name="operation"></param>
	/// <param name="context"></param>
	public void Apply(OpenApiOperation operation, OperationFilterContext context)
	{
		operation.Parameters ??= new List<OpenApiParameter>();

		var apiVersionParameter = operation.Parameters.FirstOrDefault(p => p.Name == "api-version");
		if (apiVersionParameter != default) operation.Parameters.Remove(apiVersionParameter);
	}
}