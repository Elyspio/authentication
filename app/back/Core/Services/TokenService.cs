using Authentication.Api.Abstractions.Interfaces.Services;
using Authentication.Api.Abstractions.Transports.Data;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Serialization;
using System.IdentityModel.Tokens.Jwt;
using System.Text;

namespace Authentication.Api.Core.Services;

public class TokenService : ITokenService
{
	private readonly IConfiguration _config;

	public TokenService(IConfiguration configuration)
	{
		_config = configuration;

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
		var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
		var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);


		var token = new JwtSecurityToken(_config["Jwt:Issuer"],
			_config["Jwt:Audience"],
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


		return new JwtSecurityTokenHandler().WriteToken(token);
	}

	public bool ValidateJwt(string? token, out JwtSecurityToken? validatedToken)
	{
		validatedToken = null;

		if (token == null)
			return false;


		token = token[("Bearer".Length + 1)..];

		var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
		var tokenHandler = new JwtSecurityTokenHandler();

		try
		{
			tokenHandler.ValidateToken(token, new()
			{
				ValidateIssuerSigningKey = true,
				IssuerSigningKey = securityKey,
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
}