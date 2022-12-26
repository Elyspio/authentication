using Authentication.Api.Abstractions.Transports.Data;
using System.IdentityModel.Tokens.Jwt;

namespace Authentication.Api.Abstractions.Interfaces.Services;

public interface ITokenService
{
	public string GenerateJwt(User user);

	bool ValidateJwt(string? token, out JwtSecurityToken? validatedToken);
}