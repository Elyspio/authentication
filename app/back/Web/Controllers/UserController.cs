using Authentication.Api.Abstractions.Interfaces.Services;
using Authentication.Api.Abstractions.Transports.Data;
using Authentication.Api.Abstractions.Transports.Data.user;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NSwag.Annotations;
using System.Net;

namespace Authentication.Api.Web.Controllers;

[Route("api/users")]
[ApiController]
[Filters.Authorize(AuthenticationRoles.Admin)]
public class UsersController : ControllerBase
{
	private readonly IAuthenticationService _authenticationService;
	private readonly IUserService _userService;

	public UsersController(IUserService userService, IAuthenticationService authenticationService)
	{
		_userService = userService;
		_authenticationService = authenticationService;
	}

	/// <summary>
	///     Get a specific user
	/// </summary>
	/// <param name="id"></param>
	/// <returns></returns>
	[HttpGet("{id:guid}")]
	[SwaggerResponse(HttpStatusCode.OK, typeof(User))]
	public async Task<IActionResult> Get(Guid id)
	{
		return Ok(await _userService.Get(id));
	}

	/// <summary>
	///     Update an user
	/// </summary>
	/// <param name="id"></param>
	/// <param name="user"></param>
	/// <returns></returns>
	[HttpPut("{id:guid}")]
	[Filters.Authorize(AuthenticationRoles.User)]
	[SwaggerResponse(HttpStatusCode.NoContent, typeof(void))]
	public async Task<IActionResult> UpdateUser(Guid id, [FromBody] User user)
	{
		user.Id = id;
		await _userService.Update(user);
		return NoContent();
	}

	/// <summary>
	///     Delete an user
	/// </summary>
	/// <param name="id"></param>
	/// <returns></returns>
	[HttpDelete("{id:guid}")]
	[SwaggerResponse(HttpStatusCode.NoContent, typeof(void))]
	public async Task<IActionResult> DeleteUser(Guid id)
	{
		await _userService.Delete(id);
		return NoContent();
	}

	/// <summary>
	///     Get all users
	/// </summary>
	/// <returns></returns>
	[HttpGet]
	[SwaggerResponse(HttpStatusCode.OK, typeof(List<User>))]
	public async Task<IActionResult> GetAll()
	{
		return Ok(await _userService.GetAll());
	}

	/// <summary>
	///     Get if there is at least one user in database
	/// </summary>
	/// <returns>If at least one user exist in database</returns>
	[HttpPost("any")]
	[AllowAnonymous]
	[SwaggerResponse(HttpStatusCode.OK, typeof(bool))]
	public async Task<IActionResult> CheckIfUsersExist()
	{
		return Ok(await _authenticationService.CheckIfUsersExist());
	}
}