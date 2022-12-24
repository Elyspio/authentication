namespace Authentication.Api.Abstractions.Transports.Responses;

public record InitVerifyResponse(string Salt, string Challenge);