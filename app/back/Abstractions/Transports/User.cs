using Authentication.Api.Abstractions.Transports.user;
using System.ComponentModel.DataAnnotations;

namespace Authentication.Api.Abstractions.Transports;

public class User : UserBase
{
	[Required] public Guid Id { get; init; }
}