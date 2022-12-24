using Authentication.Api.Abstractions.Transports;

namespace Authentication.Api.Abstractions.Interfaces.Services;

public interface IAuthenticationService
{
	/// <summary>
	///     Register a new user
	/// </summary>
	/// <param name="username">user's name, must be unique</param>
	/// <param name="hash">Hashed and salted password</param>
	/// <returns>the created user</returns>
	Task<User> Register(string username, string hash);


	/// <summary>
	///     Return if at least one user is stored in database
	/// </summary>
	/// <returns></returns>
	Task<bool> CheckIfUsersExist();

	/// <summary>
	///     Create a salt for this username
	/// </summary>
	/// <param name="username"></param>
	/// <returns></returns>
	string RegisterInit(string username);
}