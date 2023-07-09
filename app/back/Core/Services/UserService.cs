using Authentication.Api.Abstractions.Helpers;
using Authentication.Api.Abstractions.Interfaces.Hubs;
using Authentication.Api.Abstractions.Interfaces.Repositories;
using Authentication.Api.Abstractions.Interfaces.Services;
using Authentication.Api.Abstractions.Technical;
using Authentication.Api.Abstractions.Transports.Data;
using Authentication.Api.Core.Assemblers;
using Authentication.Api.Sockets.Hubs;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;

namespace Authentication.Api.Core.Services;

public class UserService(ILogger<UserService> logger, IUsersRepository usersRepository, IHubContext<UpdateHub, IUpdateHub> hubContext) : TracingContext(logger), IUserService
{
	private readonly IHubContext<UpdateHub, IUpdateHub> _hubContext = hubContext;
	private readonly ILogger<UserService> _logger = logger;
	private readonly UserAssembler _userAssembler = new();
	private readonly IUsersRepository _usersRepository = usersRepository;


	public async Task<User> Get(Guid id)
	{
		using var _ = LogService(Log.F(id));

		var entity = await _usersRepository.Get(id);
		var data = _userAssembler.Convert(entity);


		return data;
	}

	public async Task<List<User>> GetAll()
	{
		using var _ = LogService();

		var entity = await _usersRepository.GetAll();
		var data = _userAssembler.Convert(entity);

		return data;
	}

	public async Task Update(User user)
	{
		using var _ = LogService(Log.F(user.Id));

		var entity = _userAssembler.Convert(user);

		await _usersRepository.Update(entity);

		await _hubContext.Clients.All.UserUpdated(user);
	}

	public async Task Delete(Guid id)
	{
		using var _ = LogService(Log.F(id));

		await _usersRepository.Delete(id);

		await _hubContext.Clients.All.UserDeleted(id);
	}
}