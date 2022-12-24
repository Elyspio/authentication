namespace Authentication.Api.Abstractions.Transports.user;

public class Credentials
{
	public Github? Github { get; set; }
	public Docker? Docker { get; set; }
}