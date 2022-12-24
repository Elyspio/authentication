using Authentication.Api.Abstractions.Transports;

namespace Authentication.Api.Abstractions.Interfaces.Services;

public interface IUserService
{
	/// <summary>
	///     Return an user from its username
	/// </summary>
	/// <param name="username"></param>
	/// <returns></returns>
	Task<User> Get(string username);
}