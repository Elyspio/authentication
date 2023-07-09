using Authentication.Api.Abstractions.Helpers;
using Authentication.Api.Abstractions.Interfaces.Services;
using Authentication.Api.Abstractions.Technical;
using Authentication.Api.Abstractions.Transports.Data;
using Authentication.Api.Abstractions.Transports.Responses;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;

namespace Authentication.Api.Web.Controllers;

[Route("api/auth/{username}/")]
[ApiController]
public class AuthenticationController(IAuthenticationService authenticationService, ILogger<AuthenticationController> logger) : TracingContext(logger)
{
	private readonly IAuthenticationService _authenticationService = authenticationService;

	/// <summary>
	///     Final register step
	/// </summary>
	/// <param name="username"></param>
	/// <param name="hash">user's password hashed with salt</param>
	/// <returns>the created user</returns>
	[HttpPost("register/finalize")]
	[SwaggerResponse(StatusCodes.Status201Created, Type = typeof(User))]
	public async Task<IResult> Register(string username, [FromBody] string hash)
	{
		using var _ = LogController($"{Log.F(username)} {Log.F(hash)}");
		var user = await _authenticationService.Register(username, hash);
		return Results.Created($"api/auth/{username}", user);
	}


	/// <summary>
	///     First register step
	/// </summary>
	/// <param name="username"></param>
	/// <returns>a salt for this username</returns>
	[HttpPost("register/init")]
	[SwaggerResponse(StatusCodes.Status200OK, Type = typeof(InitRegisterResponse))]
	public IResult InitRegister(string username)
	{
		using var _ = LogController($"{Log.F(username)}");
		return Results.Ok(new InitRegisterResponse(_authenticationService.InitRegister(username)));
	}


	/// <summary>
	///     Change user's password
	/// </summary>
	/// <param name="username"></param>
	/// <param name="hash">user's password hashed with salt</param>
	/// <returns>the created user</returns>
	[HttpPut("password/finalize")]
	[SwaggerResponse(StatusCodes.Status204NoContent, Type = typeof(void))]
	public async Task<IResult> ChangePassword(string username, [FromBody] string hash)
	{
		using var _ = LogController($"{Log.F(username)} {Log.F(hash)}");
		await _authenticationService.ChangePassword(username, hash);
		return Results.NoContent();
	}


	/// <summary>
	///     First step to change user's password
	/// </summary>
	/// <param name="username"></param>
	/// <returns>a salt for this username</returns>
	[HttpPut("password/init")]
	[SwaggerResponse(StatusCodes.Status200OK, Type = typeof(InitRegisterResponse))]
	public IResult InitChangePassword(string username)
	{
		using var _ = LogController($"{Log.F(username)}");
		return Results.Ok(new InitRegisterResponse(_authenticationService.InitChangePassword(username)));
	}


	/// <summary>
	///     Final login step
	/// </summary>
	/// <param name="username"></param>
	/// <param name="hash"></param>
	/// <returns>a JWT for this user</returns>
	[HttpPost("login/finalize")]
	[SwaggerResponse(StatusCodes.Status200OK, Type = typeof(string))]
	public async Task<IResult> Login(string username, [FromBody] string hash)
	{
		using var _ = LogController($"{Log.F(username)} {Log.F(hash)}");
		return Results.Ok(await _authenticationService.Login(username, hash));
	}


	/// <summary>
	///     First login step
	/// </summary>
	/// <param name="username"></param>
	/// <returns>a challenge for this username</returns>
	[HttpPost("login/init")]
	[SwaggerResponse(StatusCodes.Status200OK, Type = typeof(InitVerifyResponse))]
	public async Task<IResult> InitLogin([FromRoute] string username)
	{
		using var _ = LogController($"{Log.F(username)}");
		return Results.Ok(await _authenticationService.InitLogin(username));
	}
}