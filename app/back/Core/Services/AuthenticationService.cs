using Authentication.Api.Abstractions.Exceptions;
using Authentication.Api.Abstractions.Helpers;
using Authentication.Api.Abstractions.Interfaces.Repositories;
using Authentication.Api.Abstractions.Interfaces.Services;
using Authentication.Api.Abstractions.Models;
using Authentication.Api.Abstractions.Transports;
using Authentication.Api.Abstractions.Transports.Data;
using Authentication.Api.Abstractions.Transports.Responses;
using Authentication.Api.Core.Assemblers;
using Microsoft.Extensions.Logging;
using SHA3.Net;
using System.Net;
using System.Security.Cryptography;
using System.Text;

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
	private readonly Dictionary<string, string> _loggingChallenges = new();

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

	public string InitRegister(string username)
	{
		var logger = _logger.Enter(Log.Format(username));


		if (_registringSalts.ContainsKey(username)) return _registringSalts[username];

		var salt = GenerateRandom();
		_registringSalts.TryAdd(username, salt);

		logger.Exit();

		return salt;
	}

	public async Task<bool> Verify(string username, string hash)
	{
		var logger = _logger.Enter(Log.Format(username));


		if (!_loggingChallenges.TryGetValue(hash, out var challenge)) throw new HttpException(HttpStatusCode.FailedDependency, $"There was no user named {username} logging in");

		var storedUser = await _usersRepository.Get(username);

		if (storedUser == default) throw new HttpException(HttpStatusCode.NotFound, $"There is no user '{username}' in database");
	
		var storedHash = ComputeSignature(storedUser.Hash, challenge);

		var match = storedHash == hash;

		logger.Debug($"{username}: {Log.Format(match)}");

		if (match)
		{
			_loggingChallenges.Remove(username);
		}
		
		logger.Exit();

		return match;
	}

	public async Task<InitVerifyResponse> InitVerify(string username)
	{
		var logger = _logger.Enter(Log.Format(username));

		_loggingChallenges.TryGetValue(username, out var challenge);

		challenge ??= GenerateRandom();

		_loggingChallenges.TryAdd(username, challenge);

		var storedUser = await _usersRepository.Get(username);
		if (storedUser == default) throw new HttpException(HttpStatusCode.NotFound, $"There is no user '{username}' in database");

		logger.Exit();

		return new(storedUser.Salt, challenge);
	}


	private string GenerateRandom()
	{
		return Convert.ToBase64String(RandomNumberGenerator.GetBytes(32));
	}

	private string ComputeSignature(string hash, string challenge)
	{
		using var shaAlg = Sha3.Sha3256();
		var bytes = shaAlg.ComputeHash(Encoding.UTF8.GetBytes(hash + challenge));
		return Convert.ToBase64String(bytes);
	}
}