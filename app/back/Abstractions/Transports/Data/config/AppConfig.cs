namespace Authentication.Api.Abstractions.Transports.Data.config;

public class AppConfig
{
	public required string Database { get; set; }
	public required Jwt Jwt { get; set; }
	public required string AllowedHosts { get; set; }
}