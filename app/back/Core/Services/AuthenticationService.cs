using Authentication.Api.Abstractions.Exceptions;
using Authentication.Api.Abstractions.Helpers;
using Authentication.Api.Abstractions.Interfaces.Hubs;
using Authentication.Api.Abstractions.Interfaces.Repositories;
using Authentication.Api.Abstractions.Interfaces.Services;
using Authentication.Api.Abstractions.Technical;
using Authentication.Api.Abstractions.Transports.Data;
using Authentication.Api.Abstractions.Transports.Responses;
using Authentication.Api.Core.Assemblers;
using Authentication.Api.Sockets.Hubs;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using SHA3.Net;
using System.Net;
using System.Security.Cryptography;
using System.Text;

namespace Authentication.Api.Core.Services;

public class AuthenticationService(IUsersRepository usersRepository, ILogger<UserService> logger, ITokenService tokenService, IHubContext<UpdateHub, IUpdateHub> hubContext) : TracingContext(logger), IAuthenticationService
{
	private readonly IHubContext<UpdateHub, IUpdateHub> _hubContext = hubContext;


	/// <summary>
	///     Map a username to its generated challenge
	/// </summary>
	private readonly Dictionary<string, string> _loggingChallenges = new();

	/// <summary>
	///     Map a username to its generated salt
	/// </summary>
	private readonly Dictionary<string, string> _registringSalts = new();

	private readonly ITokenService _tokenService = tokenService;
	private readonly UserAssembler _userAssembler = new();
	private readonly IUsersRepository _usersRepository = usersRepository;


	public async Task<User> Register(string username, string hash)
	{
		using var _ = LogService($"{Log.F(username)}");

		if (!_registringSalts.TryGetValue(username, out var salt)) throw new HttpException(HttpStatusCode.FailedDependency, $"There was no user named {username} registring");

		var entity = await _usersRepository.Add(username, salt, hash);
		var data = _userAssembler.Convert(entity);

		await _hubContext.Clients.All.UserUpdated(data);

		return data;
	}


	public async Task<bool> CheckIfUsersExist()
	{
		using var _ = LogService();

		var exist = await _usersRepository.CheckIfUsersExist();

		return exist;
	}

	public string InitRegister(string username)
	{
		using var _ = LogService(Log.F(username));

		if (_registringSalts.TryGetValue(username, out var salt)) return salt;

		salt = GenerateRandom();
		_registringSalts.TryAdd(username, salt);

		return salt;
	}

	public async Task<string> Login(string username, string hash)
	{
		using var logger = LogService(Log.F(username));

		if (!_loggingChallenges.TryGetValue(username, out var challenge)) throw new HttpException(HttpStatusCode.FailedDependency, $"There was no user named {username} logging in");

		var storedUser = await _usersRepository.Get(username);

		if (storedUser == default) throw new HttpException(HttpStatusCode.NotFound, $"There is no user '{username}' in database");

		var storedHash = ComputeSignature(storedUser.Hash!, challenge);

		var match = storedHash == hash;

		logger.Debug($"{Log.F(match)}");

		if (match) _loggingChallenges.Remove(username);
		else throw new HttpException(HttpStatusCode.Forbidden, "Wrong password");

		storedUser.LastConnection = DateTime.Now;
		await _usersRepository.Update(storedUser);

		var jwt = _tokenService.GenerateJwt(_userAssembler.Convert(storedUser));

		return jwt;
	}

	public async Task<InitVerifyResponse> InitLogin(string username)
	{
		using var _ = LogService(Log.F(username));

		_loggingChallenges.TryGetValue(username, out var challenge);

		challenge ??= GenerateRandom();

		_loggingChallenges.TryAdd(username, challenge);

		var storedUser = await _usersRepository.Get(username);

		if (storedUser == default) throw new HttpException(HttpStatusCode.NotFound, $"There is no user '{username}' in database");

		if (storedUser.Disabled) throw new HttpException(HttpStatusCode.Locked, $"The user '{username}' is disabled");

		return new(storedUser.Salt!, challenge);
	}

	public string InitChangePassword(string username)
	{
		using var _ = LogService($"{Log.F(username)}");
		
		return InitRegister(username);
	}

	public async Task ChangePassword(string username, string hash)
	{
		using var _ = LogService(Log.F(username));

		if (!_registringSalts.TryGetValue(username, out var salt)) throw new HttpException(HttpStatusCode.FailedDependency, $"There was no user named {username} changing password");

		await _usersRepository.ChangePassword(username, salt, hash);
	}

	private string GenerateRandom()
	{
		using var _ = LogService();
		
		return Convert.ToBase64String(RandomNumberGenerator.GetBytes(32));
	}

	private string ComputeSignature(string hash, string challenge)
	{
		using var _ = LogService($"{Log.F(hash)} {challenge}");
		
		using var shaAlg = Sha3.Sha3512();
		var bytes = shaAlg.ComputeHash(Encoding.UTF8.GetBytes(hash + challenge));
		return Convert.ToBase64String(bytes);
	}
}