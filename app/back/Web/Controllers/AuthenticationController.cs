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
	/// </summary>
	/// <param name="username"></param>
	/// <param name="hash">user's password hashed with salt</param>
	/// <returns></returns>
	[HttpPost]
	[SwaggerResponse(HttpStatusCode.Created, typeof(User))]
	public async Task<IActionResult> Register(string username, [FromBody] string hash)
	{
		var user = await _authenticationService.Register(username, hash);
		return Created($"api/auth/{username}", user);
	}


	[HttpPost("init")]
	[SwaggerResponse(HttpStatusCode.OK, typeof(InitRegisterResponse))]
	public IActionResult InitRegister(string username)
	{
		return Ok(new InitRegisterResponse(_authenticationService.InitRegister(username)));
	}

	[HttpPost("login")]
	[SwaggerResponse(HttpStatusCode.OK, typeof(bool))]
	public async Task<IActionResult> Verify(string username, [FromBody] string hash)
	{
		return Ok(await _authenticationService.Verify(username, hash));
	}


	[HttpPost("login/init")]
	[SwaggerResponse(HttpStatusCode.OK, typeof(InitVerifyResponse))]
	public async Task<IActionResult> InitVerify([FromRoute] string username)
	{
		return Ok(await _authenticationService.InitVerify(username));
	}
}