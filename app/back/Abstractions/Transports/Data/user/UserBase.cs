using Mapster;
using System.Text.Json.Serialization;

namespace Authentication.Api.Abstractions.Transports.Data.user;

public class UserBase
{
	public required string Username { get; set; }

	[AdaptIgnore]
	[JsonIgnore]
	public required string Hash { get; set; }

	[AdaptIgnore]
	[JsonIgnore]
	public required string Salt { get; set; }

	public required Settings Settings { get; set; }
	public required Credentials Credentials { get; set; }
	public required Authorizations Authorizations { get; set; }

	public DateTime? LastConnection { get; set; }

	public bool Disabled { get; set; }
}