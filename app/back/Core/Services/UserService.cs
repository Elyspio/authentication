using Authentication.Api.Abstractions.Helpers;
using Authentication.Api.Abstractions.Interfaces.Hubs;
using Authentication.Api.Abstractions.Interfaces.Repositories;
using Authentication.Api.Abstractions.Interfaces.Services;
using Authentication.Api.Abstractions.Transports.Data;
using Authentication.Api.Core.Assemblers;
using Authentication.Api.Sockets.Hubs;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;

namespace Authentication.Api.Core.Services;

public class UserService : IUserService
{
	private readonly IHubContext<UpdateHub, IUpdateHub> _hubContext;
	private readonly ILogger<UserService> _logger;
	private readonly UserAssembler _userAssembler = new();
	private readonly IUsersRepository _usersRepository;


	public UserService(ILogger<UserService> logger, IUsersRepository usersRepository, IHubContext<UpdateHub, IUpdateHub> hubContext)
	{
		_logger = logger;
		_usersRepository = usersRepository;
		_hubContext = hubContext;
	}


	public async Task<User> Get(Guid id)
	{
		var logger = _logger.Enter(Log.F(id));

		var entity = await _usersRepository.Get(id);
		var data = _userAssembler.Convert(entity);

		logger.Exit();

		return data;
	}

	public async Task<List<User>> GetAll()
	{
		var logger = _logger.Enter();

		var entity = await _usersRepository.GetAll();
		var data = _userAssembler.Convert(entity);

		logger.Exit();

		return data;
	}

	public async Task Update(User user)
	{
		var logger = _logger.Enter(Log.F(user.Id));

		var entity = _userAssembler.Convert(user);

		await _usersRepository.Update(entity);

		await _hubContext.Clients.All.UserUpdated(user);

		logger.Exit();
	}

	public async Task Delete(Guid id)
	{
		var logger = _logger.Enter(Log.F(id));

		await _usersRepository.Delete(id);

		await _hubContext.Clients.All.UserDeleted(id);

		logger.Exit();
	}
}