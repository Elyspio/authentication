namespace Authentication.Api.Abstractions.Transports.Data.user;

public class Github
{
	public required string Token { get; set; }
	public required string User { get; set; }
}