using Authentication.Api.Abstractions.Interfaces.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace Authentication.Api.Sockets.Hubs;

public class UpdateHub : Hub<IUpdateHub>
{
}