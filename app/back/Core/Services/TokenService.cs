using Authentication.Api.Abstractions.Interfaces.Services;
using Authentication.Api.Abstractions.Transports.Data;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using JsonConverter = Newtonsoft.Json.JsonConverter;

namespace Authentication.Api.Core.Services;

public class TokenService : ITokenService
{
	private readonly IConfiguration _config;

	public TokenService(IConfiguration configuration)
	{
		_config = configuration;
		
		var jsonSerializerSettings = new JsonSerializerSettings()
		{
			Converters = new List<JsonConverter>()
			{
				new StringEnumConverter()
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
}