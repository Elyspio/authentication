using Authentication.Api.Abstractions.Helpers;
using Authentication.Api.Abstractions.Interfaces.Repositories;
using Authentication.Api.Abstractions.Interfaces.Services;
using Authentication.Api.Abstractions.Technical;
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
using System.Text.Json;

namespace Authentication.Api.Core.Services;

public class TokenService(IOptions<AppConfig> configuration, ILogger<TokenService> logger, IUsersRepository usersRepository) : TracingContext(logger), ITokenService
{
	private readonly AppConfig _config = configuration.Value;
	private readonly UserAssembler _userAssembler = new();
	private readonly IUsersRepository _usersRepository = usersRepository;


	private SecurityKey? _privateKey;
	private SecurityKey? _publicKey;


	/// <summary>
	///     Serialization of the user stored in the "data" claim (camelCase, enums as strings), as the front-end expects.
	///     Microsoft.IdentityModel 7+ serializes payloads with System.Text.Json and no longer exposes a serializer hook,
	///     so the claim is pre-serialized with these settings and embedded as raw JSON.
	/// </summary>
	private static readonly JsonSerializerSettings JwtDataSerializerSettings = new()
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


	public string GenerateJwt(User user)
	{
		using var logger = LogService(Log.F(user.Username));

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
					"data", System.Text.Json.JsonSerializer.Deserialize<JsonElement>(JsonConvert.SerializeObject(user, Formatting.None, JwtDataSerializerSettings))
				}
			}
		};

		var token = new JwtSecurityTokenHandler().WriteToken(jwt);

		logger.Exit();

		return token;
	}

	public async Task<string> RefreshJwt(Guid idUser)
	{
		using var logger = LogService(Log.F(idUser));

		var user = await _usersRepository.Get(idUser);

		var jwt = GenerateJwt(_userAssembler.Convert(user));

		logger.Exit();

		return jwt;
	}

	public bool ValidateJwt(string? token, out JwtSecurityToken? validatedToken)
	{
		using var _ = LogService($"{Log.F(token)}");

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
		using var _ = LogService();

		var key = RSA.Create();

		key.ImportFromPem(_config.Jwt.PrivateKey);

		var pem = key.ExportRSAPublicKeyPem();


		return pem;
	}


	private SecurityKey GetPrivateKey()
	{
		using var _ = LogService();

		if (_privateKey != default) return _privateKey;

		var key = RSA.Create();

		key.ImportFromPem(_config.Jwt.PrivateKey);

		_privateKey = new RsaSecurityKey(key);


		return _privateKey;
	}

	private SecurityKey GetPublicKey()
	{
		using var _ = LogService();

		if (_publicKey != default) return _publicKey;

		var key = GetPublicKeyRaw();
		var rsa = RSA.Create();

		rsa.ImportFromPem(key);

		_publicKey = new RsaSecurityKey(rsa);

		return _publicKey;
	}
}