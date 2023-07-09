using Authentication.Api.Abstractions.Interfaces.Services;
using Authentication.Api.Abstractions.Technical;
using Authentication.Api.Abstractions.Transports.Data.user;
using Authentication.Api.Abstractions.Transports.Responses;
using Authentication.Api.Web.Filters;
using Authentication.Api.Web.Utils;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;

namespace Authentication.Api.Web.Controllers;

[Route("api/jwt")]
[ApiController]
public class JwtController(ITokenService tokenService, IHttpContextAccessor httpContextAccessor, ILogger<JwtController> logger) : TracingContext(logger)
{
	private readonly ITokenService _tokenService = tokenService;

	private readonly HttpRequest _request = httpContextAccessor.HttpContext!.Request;

	/// <summary>
	///     Verify if Jwt is still valid
	/// </summary>
	/// <returns>a JWT for this user</returns>
	[HttpGet("verify")]
	[SwaggerResponse(StatusCodes.Status200OK, Type = typeof(bool))]
	public IResult Verify()
	{
		using var _ = LogController();
		return Results.Ok(_tokenService.ValidateJwt(_request.Headers.Authorization.ToString(), out var __));
	}


	/// <summary>
	///     Get public RSA key used for Jwt validation
	/// </summary>
	/// <returns>a JWT for this user</returns>
	[HttpGet("validation-key")]
	[SwaggerResponse(StatusCodes.Status200OK, Type = typeof(StringResponse))]
	public IResult GetValidationKey()
	{
		using var _ = LogController();
		return Results.Ok(new StringResponse(_tokenService.GetPublicKeyRaw()));
	}


	/// <summary>
	///     Refresh a JWT
	/// </summary>
	/// <returns>a JWT for this user</returns>
	[HttpPost("refresh")]
	[SwaggerResponse(StatusCodes.Status200OK, Type = typeof(StringResponse))]
	[Authorize(AuthenticationRoles.User)]
	public async Task<IResult> RefreshJwt()
	{
		using var _ = LogController();
		var jwt = await _tokenService.RefreshJwt(_request.GetUser().Id);
		return Results.Ok(new StringResponse(jwt));
	}
}