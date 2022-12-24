namespace Authentication.Api.Web.Transports.Requests;

public record UserRegisterRequest(string Hash, string Salt);