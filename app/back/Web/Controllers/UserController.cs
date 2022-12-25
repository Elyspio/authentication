using Authentication.Api.Abstractions.Interfaces.Services;
using Authentication.Api.Abstractions.Transports.Data;
using Microsoft.AspNetCore.Mvc;
using NSwag.Annotations;
using System.Net;

namespace Authentication.Api.Web.Controllers;

[Route("api/auth")]
[ApiController]
public class UsersController : ControllerBase
{
	private readonly IUserService _userService;
	private readonly IAuthenticationService _authenticationService;

	public UsersController(IUserService userService, IAuthenticationService authenticationService)
	{
		_userService = userService;
		_authenticationService = authenticationService;
	}
	
	/// <summary>
	/// Get a specific user
	/// </summary>
	/// <param name="username"></param>
	/// <returns></returns>
	[HttpGet("{username}")]
	[SwaggerResponse(HttpStatusCode.OK, typeof(User))]
	public async Task<IActionResult> Get(string username)
	{
		return Ok(await _userService.Get(username));
	}
	
	/// <summary>
	/// Get all users
	/// </summary>
	/// <returns></returns>
	[HttpGet]
	[SwaggerResponse(HttpStatusCode.OK, typeof(List<User>))]
	public async Task<IActionResult> GetAll()
	{
		return Ok(await _userService.GetAll());
	}
	
	/// <summary>
	/// Get if there is at least one user in database
	/// </summary>
	/// <returns>If at least one user exist in database</returns>
	[HttpPost("any")]
	[SwaggerResponse(HttpStatusCode.OK, typeof(bool))]
	public async Task<IActionResult> CheckIfUsersExist()
	{
		return Ok(await _authenticationService.CheckIfUsersExist());
	}
}