using Authentication.Api.Abstractions.Interfaces.Services;
using Authentication.Api.Abstractions.Transports;
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

	[HttpPost]
	[SwaggerResponse(HttpStatusCode.OK, typeof(User))]
	public async Task<IActionResult> Register(string username, [FromBody] string hash)
	{
		return Ok(await _authenticationService.Register(username, hash));
	}


	[HttpPost("init")]
	[SwaggerResponse(HttpStatusCode.OK, typeof(User))]
	public IActionResult RegisterInit(string username)
	{
		return Ok(_authenticationService.RegisterInit(username));
	}
}