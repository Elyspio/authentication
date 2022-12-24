using Authentication.Api.Abstractions.Exceptions;
using Authentication.Api.Abstractions.Helpers;
using Authentication.Api.Abstractions.Interfaces.Repositories;
using Authentication.Api.Abstractions.Interfaces.Services;
using Authentication.Api.Abstractions.Transports;
using Authentication.Api.Core.Assemblers;
using Microsoft.Extensions.Logging;
using System.Net;
using System.Security.Cryptography;

namespace Authentication.Api.Core.Services;

public class AuthenticationService : IAuthenticationService
{
	private readonly ILogger<UserService> _logger;

	/// <summary>
	///     Map a username to its generated salt
	/// </summary>
	private readonly Dictionary<string, string> _registringSalts = new();

	private readonly UserAssembler _userAssembler = new();
	private readonly IUsersRepository _usersRepository;

	public AuthenticationService(IUsersRepository usersRepository, ILogger<UserService> logger)
	{
		_usersRepository = usersRepository;
		_logger = logger;
	}


	public async Task<User> Register(string username, string hash)
	{
		var logger = _logger.Enter($"{Log.Format(username)}");

		if (!_registringSalts.TryGetValue(username, out var salt)) throw new HttpException(HttpStatusCode.FailedDependency, $"There was no user named {username} registring");

		var entity = await _usersRepository.Add(username, salt, hash);
		var data = _userAssembler.Convert(entity);

		logger.Exit();

		return data;
	}


	public async Task<bool> CheckIfUsersExist()
	{
		var logger = _logger.Enter();

		var exist = await _usersRepository.CheckIfUsersExist();

		logger.Exit();

		return exist;
	}

	public string RegisterInit(string username)
	{
		var logger = _logger.Enter(Log.Format(username));


		if (_registringSalts.ContainsKey(username)) throw new HttpException(HttpStatusCode.Conflict, $"the user {username} is already registring");
		
		var salt = GenerateSalt();
		_registringSalts[username] = salt;

		logger.Exit();
		
		return salt;
	}


	private string GenerateSalt()
	{
		return Convert.ToBase64String(RandomNumberGenerator.GetBytes(32));
	}
}