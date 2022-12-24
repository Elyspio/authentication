using System.ComponentModel.DataAnnotations;

namespace Authentication.Api.Abstractions.Transports
{
	public class Todo
	{
		[Required] public Guid Id { get; init; }

		[Required] public string Label { get; init; }

		[Required] public string User { get; init; }

		[Required] public bool Checked { get; init; }
	}
}