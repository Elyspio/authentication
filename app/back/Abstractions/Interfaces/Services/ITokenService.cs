using Authentication.Api.Abstractions.Transports.Data;
using System.IdentityModel.Tokens.Jwt;

namespace Authentication.Api.Abstractions.Interfaces.Services;

public interface ITokenService
{
	string GenerateJwt(User user);

    Task<string> RefreshJwt(Guid idUser);


	bool ValidateJwt(string? token, out JwtSecurityToken? validatedToken);


	string GetPublicKeyRaw();
}