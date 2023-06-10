namespace Authentication.Api.Abstractions.Transports.Data.user;

public class SousMarinJaune
{
	public required List<SousMarinJauneRole> Roles { get; set; }
}

public enum SousMarinJauneRole
{
	Admin,
	User
}