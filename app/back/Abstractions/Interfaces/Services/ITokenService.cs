using Authentication.Api.Abstractions.Transports.Data;

namespace Authentication.Api.Abstractions.Interfaces.Services;

public interface ITokenService
{
	public string GenerateJwt(User user);
}