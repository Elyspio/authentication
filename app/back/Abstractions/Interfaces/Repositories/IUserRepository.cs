using Authentication.Api.Abstractions.Models;

namespace Authentication.Api.Abstractions.Interfaces.Repositories;

public interface IUsersRepository
{
	/// <summary>
	///     Register a new user
	/// </summary>
	/// <param name="username">user's name, must be unique</param>
	/// <param name="salt">generated salt for this user</param>
	/// <param name="hash">Hashed and salted password</param>
	/// <returns>the created user</returns>
	Task<UserEntity> Add(string username, string salt, string hash);


	/// <summary>
	///     Return an user from its username
	/// </summary>
	/// <param name="username"></param>
	/// <returns></returns>
	Task<UserEntity?> Get(string username);


	/// <summary>
	///     Return if at least one user is stored in database
	/// </summary>
	/// <returns></returns>
	Task<bool> CheckIfUsersExist();

	/// <summary>
	///     Returns all users
	/// </summary>
	/// <returns></returns>
	Task<List<UserEntity>> GetAll();
}