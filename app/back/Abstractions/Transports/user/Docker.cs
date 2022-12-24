namespace Authentication.Api.Abstractions.Transports.user;

public class Docker
{
	public required string Username { get; set; }
	public required string Password { get; set; }
}