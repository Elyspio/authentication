using Authentication.Api.Abstractions.Transports.Data;
using Authentication.Api.Abstractions.Transports.Responses;

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
	string InitRegister(string username);


	/// <summary>
	///     Verify user's hash with the one stored in database
	/// </summary>
	/// <param name="username"></param>
	/// <param name="hash"></param>
	/// <returns>user's JWT</returns>
	Task<string> Login(string username, string hash);

	/// <summary>
	///     Create a login challenge for this user
	/// </summary>
	/// <param name="username"></param>
	/// <returns></returns>
	Task<InitVerifyResponse> InitLogin(string username);


	/// <summary>
	///     Recreate salt for this username
	/// </summary>
	/// <param name="username"></param>
	/// <returns></returns>
	string InitChangePassword(string username);

	/// <summary>
	///     Change user's password
	/// </summary>
	/// <param name="username">user's name, must be unique</param>
	/// <param name="hash">Hashed and salted password</param>
	/// <returns>the created user</returns>
	Task ChangePassword(string username, string hash);
}