using Authentication.Api.Abstractions.Interfaces.Services;
using Authentication.Api.Abstractions.Transports.Data;
using Authentication.Api.Abstractions.Transports.Data.user;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Newtonsoft.Json;

namespace Authentication.Api.Web.Filters;

[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
public class AuthorizeAttribute(AuthenticationRoles role) : Attribute, IAuthorizationFilter
{
	private readonly AuthenticationRoles _role = role;


	/// <inheritdoc />
	public void OnAuthorization(AuthorizationFilterContext context)
	{
		var svc = context.HttpContext.RequestServices;
		var tokenService = svc.GetRequiredService<ITokenService>();

		// skip authorization if action is decorated with [AllowAnonymous] attribute
		var allowAnonymous = context.ActionDescriptor.EndpointMetadata.OfType<AllowAnonymousAttribute>().Any();
		if (allowAnonymous)
			return;


		var bearer = context.HttpContext.Request.Headers.Authorization.ToString();

		if (!tokenService.ValidateJwt(bearer, out var token))
		{
			context.Result = new JsonResult(new
			{
				status = "Unauthorized"
			})
			{
				StatusCode = StatusCodes.Status401Unauthorized
			};
			return;
		}


		var userStr = token!.Payload["data"].ToString()!;

		var user = JsonConvert.DeserializeObject<User>(userStr);

		context.HttpContext.Items["user"] = user;


		if (!user.Authorizations.Authentication.Roles.Contains(_role))
			context.Result = new JsonResult(new
			{
				status = "Forbidden",
				missingRole = _role
			})
			{
				StatusCode = StatusCodes.Status403Forbidden
			};
	}
}