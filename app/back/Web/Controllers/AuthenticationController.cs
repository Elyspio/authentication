using Authentication.Api.Abstractions.Interfaces.Services;
using Authentication.Api.Abstractions.Transports.Data;
using Authentication.Api.Abstractions.Transports.Responses;
using Microsoft.AspNetCore.Mvc;
using NSwag.Annotations;
using System.Net;

namespace Authentication.Api.Web.Controllers;

[Route("api/auth")]
[ApiController]
public class AuthenticationController : ControllerBase
{
	private readonly IAuthenticationService _authenticationService;
	private readonly ITokenService _tokenService;

	public AuthenticationController(IAuthenticationService authenticationService, ITokenService tokenService)
	{
		_authenticationService = authenticationService;
		_tokenService = tokenService;
	}

	/// <summary>
	///     Final register step
	/// </summary>
	/// <param name="username"></param>
	/// <param name="hash">user's password hashed with salt</param>
	/// <returns>the created user</returns>
	[HttpPost("{username}")]
	[SwaggerResponse(HttpStatusCode.Created, typeof(User))]
	public async Task<IActionResult> Register(string username, [FromBody] string hash)
	{
		var user = await _authenticationService.Register(username, hash);
		return Created($"api/auth/{username}", user);
	}


	/// <summary>
	///     First register step
	/// </summary>
	/// <param name="username"></param>
	/// <returns>a salt for this username</returns>
	[HttpPost("{username}/init")]
	[SwaggerResponse(HttpStatusCode.OK, typeof(InitRegisterResponse))]
	public IActionResult InitRegister(string username)
	{
		return Ok(new InitRegisterResponse(_authenticationService.InitRegister(username)));
	}

	/// <summary>
	///     Final login step
	/// </summary>
	/// <param name="username"></param>
	/// <param name="hash"></param>
	/// <returns>a JWT for this user</returns>
	[HttpPost("{username}/login")]
	[SwaggerResponse(HttpStatusCode.OK, typeof(string))]
	public async Task<IActionResult> Login(string username, [FromBody] string hash)
	{
		return Ok(await _authenticationService.Login(username, hash));
	}


	/// <summary>
	///     First login step
	/// </summary>
	/// <param name="username"></param>
	/// <returns>a challenge for this username</returns>
	[HttpPost("{username}/login/init")]
	[SwaggerResponse(HttpStatusCode.OK, typeof(InitVerifyResponse))]
	public async Task<IActionResult> InitLogin([FromRoute] string username)
	{
		return Ok(await _authenticationService.InitLogin(username));
	}


	/// <summary>
	///     Verify if Jwt is still valid
	/// </summary>
	/// <returns>a JWT for this user</returns>
	[HttpGet("jwt/verify")]
	[SwaggerResponse(HttpStatusCode.OK, typeof(bool))]
	public IActionResult Verify()
	{
		return Ok(_tokenService.ValidateJwt(Request.Headers.Authorization.ToString(), out _));
	}


	/// <summary>
	///     Get public RSA key used for Jwt validation
	/// </summary>
	/// <returns>a JWT for this user</returns>
	[HttpGet("jwt/validation-key")]
	[SwaggerResponse(HttpStatusCode.OK, typeof(StringResponse))]
	public IActionResult GetValidationKey()
	{
		return Ok(new StringResponse(_tokenService.GetPublicKeyRaw()));
	}
}