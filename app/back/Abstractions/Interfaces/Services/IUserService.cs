using Authentication.Api.Abstractions.Transports.Data;

namespace Authentication.Api.Abstractions.Interfaces.Services;

public interface IUserService
{
	/// <summary>
	///     Return an user from its username
	/// </summary>
	/// <param name="username"></param>
	/// <returns></returns>
	Task<User> Get(string username);


    /// <summary>
    ///     Return all users
    /// </summary>
    /// <param name="username"></param>
    /// <returns></returns>
    Task<List<User>> GetAll();

    /// <summary>
    ///     Update an user
    /// </summary>
    /// <param name="user"></param>
    /// <returns></returns>
	Task Update(User user);
}