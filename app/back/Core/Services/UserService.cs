using Authentication.Api.Abstractions.Helpers;
using Authentication.Api.Abstractions.Interfaces.Repositories;
using Authentication.Api.Abstractions.Interfaces.Services;
using Authentication.Api.Abstractions.Transports;
using Authentication.Api.Core.Assemblers;
using Microsoft.Extensions.Logging;

namespace Authentication.Api.Core.Services;

public class UserService : IUserService
{
	private readonly ILogger<UserService> _logger;
	private readonly UserAssembler _userAssembler = new();
	private readonly IUsersRepository _usersRepository;

	public UserService(ILogger<UserService> logger, IUsersRepository usersRepository)
	{
		_logger = logger;
		_usersRepository = usersRepository;
	}


	public async Task<User> Get(string username)
	{
		var logger = _logger.Enter(Log.Format(username));

		var entity = await _usersRepository.Get(username);
		var data = _userAssembler.Convert(entity);

		logger.Exit();

		return data;
	}
}