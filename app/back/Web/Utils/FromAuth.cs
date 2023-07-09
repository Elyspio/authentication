using Authentication.Api.Abstractions.Transports.Data;

namespace Authentication.Api.Web.Utils;

public static class AuthUtility
{
	public static User GetUser(this HttpRequest request)
	{
		return (User) request.HttpContext.Items["user"];
	}

	public static string GetToken(this HttpRequest request)
	{
		return request.Headers.Authorization;
	}
}