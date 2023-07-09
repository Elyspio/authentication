using Authentication.Api.Abstractions.Helpers;
using Authentication.Api.Abstractions.Interfaces.Services;
using Authentication.Api.Abstractions.Technical;
using Authentication.Api.Abstractions.Transports.Data;
using Authentication.Api.Abstractions.Transports.Data.user;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;

namespace Authentication.Api.Web.Controllers;

[Route("api/users")]
[ApiController]
[Filters.Authorize(AuthenticationRoles.Admin)]
public class UsersController(IUserService userService, IAuthenticationService authenticationService, ILogger<UsersController> logger) : TracingContext(logger)
{
	private readonly IAuthenticationService _authenticationService = authenticationService;
	private readonly IUserService _userService = userService;

	/// <summary>
	///     Get a specific user
	/// </summary>
	/// <param name="id"></param>
	/// <returns></returns>
	[HttpGet("{id:guid}")]
	[SwaggerResponse(StatusCodes.Status200OK, Type = typeof(User))]
	public async Task<IResult> Get(Guid id)
	{
		using var _ = LogController($"{Log.F(id)}");
		return Results.Ok(await _userService.Get(id));
	}

	/// <summary>
	///     Update an user
	/// </summary>
	/// <param name="id"></param>
	/// <param name="user"></param>
	/// <returns></returns>
	[HttpPut("{id:guid}")]
	[Filters.Authorize(AuthenticationRoles.User)]
	[SwaggerResponse(StatusCodes.Status204NoContent, Type = typeof(void))]
	public async Task<IResult> UpdateUser(Guid id, [FromBody] User user)
	{
		using var _ = LogController($"{Log.F(id)}");
		user.Id = id;
		await _userService.Update(user);
		return Results.NoContent();
	}

	/// <summary>
	///     Delete an user
	/// </summary>
	/// <param name="id"></param>
	/// <returns></returns>
	[HttpDelete("{id:guid}")]
	[SwaggerResponse(StatusCodes.Status204NoContent, Type = typeof(void))]
	public async Task<IResult> DeleteUser(Guid id)
	{
		using var _ = LogController($"{Log.F(id)}");
		await _userService.Delete(id);
		return Results.NoContent();
	}

	/// <summary>
	///     Get all users
	/// </summary>
	/// <returns></returns>
	[HttpGet]
	[SwaggerResponse(StatusCodes.Status200OK, Type = typeof(List<User>))]
	public async Task<IResult> GetAll()
	{
		using var _ = LogController();
		return Results.Ok(await _userService.GetAll());
	}

	/// <summary>
	///     Get if there is at least one user in database
	/// </summary>
	/// <returns>If at least one user exist in database</returns>
	[HttpGet("any")]
	[AllowAnonymous]
	[SwaggerResponse(StatusCodes.Status200OK, Type = typeof(bool))]
	public async Task<IResult> CheckIfUsersExist()
	{
		using var _ = LogController();
		return Results.Ok(await _authenticationService.CheckIfUsersExist());
	}
}