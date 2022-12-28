using Authentication.Api.Abstractions.Transports.Data;

namespace Authentication.Api.Abstractions.Interfaces.Hubs;

public interface IUpdateHub
{
	Task UserUpdated(User user);
	Task UserDeleted(Guid username);
}