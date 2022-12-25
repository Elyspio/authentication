using Authentication.Api.Abstractions.Interfaces.Services;
using Authentication.Api.Abstractions.Transports.Data;
using Authentication.Api.Abstractions.Transports.Responses;
using Microsoft.AspNetCore.Mvc;
using NSwag.Annotations;
using System.Net;

namespace Authentication.Api.Web.Controllers;

[Route("api/auth/{username}")]
[ApiController]
public class AuthenticationController : ControllerBase
{
	private readonly IAuthenticationService _authenticationService;

	public AuthenticationController(IAuthenticationService authenticationService)
	{
		_authenticationService = authenticationService;
	}

	/// <summary>
	/// Final register step
	/// </summary>
	/// <param name="username"></param>
	/// <param name="hash">user's password hashed with salt</param>
	/// <returns>the created user</returns>
	[HttpPost]
	[SwaggerResponse(HttpStatusCode.Created, typeof(User))]
	public async Task<IActionResult> Register(string username, [FromBody] string hash)
	{
		var user = await _authenticationService.Register(username, hash);
		return Created($"api/auth/{username}", user);
	}


	/// <summary>
	/// First register step
	/// </summary>
	/// <param name="username"></param>
	/// <returns>a salt for this username</returns>
	[HttpPost("init")]
	[SwaggerResponse(HttpStatusCode.OK, typeof(InitRegisterResponse))]
	public IActionResult InitRegister(string username)
	{
		return Ok(new InitRegisterResponse(_authenticationService.InitRegister(username)));
	}

	/// <summary>
	/// Final login step
	/// </summary>
	/// <param name="username"></param>
	/// <param name="hash"></param>
	/// <returns>a JWT for this user</returns>
	[HttpPost("login")]
	[SwaggerResponse(HttpStatusCode.OK, typeof(string))]
	public async Task<IActionResult> Login(string username, [FromBody] string hash)
	{
		return Ok(await _authenticationService.Login(username, hash));
	}


	/// <summary>
	/// First login step
	/// </summary>
	/// <param name="username"></param>
	/// <returns>a challenge for this username</returns>
	[HttpPost("login/init")]
	[SwaggerResponse(HttpStatusCode.OK, typeof(InitVerifyResponse))]
	public async Task<IActionResult> InitLogin([FromRoute] string username)
	{
		return Ok(await _authenticationService.InitLogin(username));
	}
	
	

	
	
}