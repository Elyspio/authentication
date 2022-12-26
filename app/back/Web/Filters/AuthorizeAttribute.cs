using Authentication.Api.Abstractions.Interfaces.Services;
using Authentication.Api.Abstractions.Transports.Data;
using Authentication.Api.Abstractions.Transports.Data.user;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Authentication.Api.Web.Filters;

[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
public class AuthorizeAttribute : Attribute, IAuthorizationFilter
{
	private readonly AuthenticationRoles _role;


	public AuthorizeAttribute(AuthenticationRoles role)
	{
		_role = role;
	}

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


		var user = (User) token!.Payload["data"];

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