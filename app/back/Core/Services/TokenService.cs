using Authentication.Api.Abstractions.Helpers;
using Authentication.Api.Abstractions.Interfaces.Repositories;
using Authentication.Api.Abstractions.Interfaces.Services;
using Authentication.Api.Abstractions.Transports.Data;
using Authentication.Api.Abstractions.Transports.Data.config;
using Authentication.Api.Core.Assemblers;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Serialization;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Cryptography;

namespace Authentication.Api.Core.Services;

public class TokenService : ITokenService
{
	private readonly AppConfig _config;
	private readonly ILogger<TokenService> _logger;


	private SecurityKey? _privateKey;
	private SecurityKey? _publicKey;
	private readonly UserAssembler _userAssembler = new();
	private readonly IUsersRepository _usersRepository;

	public TokenService(IOptions<AppConfig> configuration, ILogger<TokenService> logger, IUsersRepository usersRepository)
	{
		_logger = logger;
		_usersRepository = usersRepository;
		_config = configuration.Value;

		var jsonSerializerSettings = new JsonSerializerSettings
		{
			Converters = new List<JsonConverter>
			{
				new StringEnumConverter()
			},
			ContractResolver = new DefaultContractResolver
			{
				NamingStrategy = new CamelCaseNamingStrategy()
			},
			NullValueHandling = NullValueHandling.Ignore,
			MissingMemberHandling = MissingMemberHandling.Ignore
		};

		JsonExtensions.Serializer = o => JsonConvert.SerializeObject(o, Formatting.None, jsonSerializerSettings);
	}


	public string GenerateJwt(User user)
	{
		var logger = _logger.Enter(Log.F(user.Username));

		var credentials = new SigningCredentials(GetPrivateKey(), SecurityAlgorithms.RsaSha512);

		var jwt = new JwtSecurityToken(_config.Jwt.Issuer,
			_config.Jwt.Audience,
			expires: DateTime.Now.AddMinutes(30),
			signingCredentials: credentials
		)
		{
			Payload =
			{
				{
					"data", user
				}
			}
		};

		var token = new JwtSecurityTokenHandler().WriteToken(jwt);

		logger.Exit();

		return token;
	}

	public async Task<string> RefreshJwt(Guid idUser)
	{
		var logger = _logger.Enter(Log.F(idUser));

		var user = await _usersRepository.Get(idUser);

		var jwt = GenerateJwt(_userAssembler.Convert(user));

		logger.Exit();

		return jwt;
	}

	public bool ValidateJwt(string? token, out JwtSecurityToken? validatedToken)
	{
		validatedToken = null;

		if (string.IsNullOrWhiteSpace(token))
			return false;


		token = token[("Bearer".Length + 1)..];

		var tokenHandler = new JwtSecurityTokenHandler();

		try
		{
			tokenHandler.ValidateToken(token, new()
			{
				ValidateIssuerSigningKey = true,
				IssuerSigningKey = GetPublicKey(),
				ValidateIssuer = false,
				ValidateAudience = false,
				// set clockskew to zero so tokens expire exactly at token expiration time (instead of 5 minutes later)
				ClockSkew = TimeSpan.Zero
			}, out var securityToken);

			validatedToken = (JwtSecurityToken?) securityToken;

			return true;
		}
		catch
		{
			return false;
		}
	}

	public string GetPublicKeyRaw()
	{
		var key = RSA.Create();

		key.ImportFromPem(_config.Jwt.PrivateKey);

		var pem = key.ExportRSAPublicKeyPem();


		return pem;
	}


	private SecurityKey GetPrivateKey()
	{
		if (_privateKey != default) return _privateKey;

		var key = RSA.Create();

		key.ImportFromPem(_config.Jwt.PrivateKey);

		_privateKey = new RsaSecurityKey(key);


		return _privateKey;
	}

	private SecurityKey GetPublicKey()
	{
		if (_publicKey != default) return _publicKey;

		var key = GetPublicKeyRaw();
		var rsa = RSA.Create();

		rsa.ImportFromPem(key);

		_publicKey = new RsaSecurityKey(rsa);

		return _publicKey;
	}
}