using Authentication.Api.Abstractions.Transports.Data.user;
using System.ComponentModel.DataAnnotations;

namespace Authentication.Api.Abstractions.Transports.Data;

public class User : UserBase
{
	[Required] public Guid Id { get; init; }
}