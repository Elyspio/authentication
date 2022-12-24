using Authentication.Api.Abstractions.Transports;
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
	/// Verify user's hash with the one stored in database
	/// </summary>
	/// <param name="username"></param>
	/// <param name="hash"></param>
	/// <returns>if the user is logged or not </returns>
	Task<bool> Verify(string username, string hash);

	/// <summary>
	///     Create a login challenge for this user
	/// </summary>
	/// <param name="username"></param>
	/// <returns></returns>
	Task<InitVerifyResponse> InitVerify(string username);

	
}