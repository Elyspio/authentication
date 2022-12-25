using Authentication.Api.Abstractions.Interfaces.Services;
using Authentication.Api.Abstractions.Transports.Data;
using Microsoft.AspNetCore.Mvc;
using NSwag.Annotations;
using System.Net;

namespace Authentication.Api.Web.Controllers;

[Route("api/auth/{username}")]
[ApiController]
public class UsersController : ControllerBase
{
	private readonly IUserService _userService;

	public UsersController(IUserService authenticationService)
	{
		_userService = authenticationService;
	}

	[HttpGet]
	[SwaggerResponse(HttpStatusCode.OK, typeof(User))]
	public async Task<IActionResult> Get(string username)
	{
		return Ok(await _userService.Get(username));
	}
}