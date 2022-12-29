namespace Authentication.Api.Abstractions.Transports.Data.config;

public class Jwt
{
	public required string PrivateKey { get; set; }
	public required string PublicKey { get; set; }
	public required string Issuer { get; set; }
	public required string Audience { get; set; }
}