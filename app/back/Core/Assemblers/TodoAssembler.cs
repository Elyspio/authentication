using Authentication.Api.Abstractions.Assemblers;
using Authentication.Api.Abstractions.Extensions;
using Authentication.Api.Abstractions.Models;
using Authentication.Api.Abstractions.Transports;

namespace Authentication.Api.Core.Assemblers
{
	public class TodoAssembler : BaseAssembler<Todo, TodoEntity>
	{
		public override Todo Convert(TodoEntity obj)
		{
			return new Todo
			{
				Checked = obj.Checked,
				Id = obj.Id.AsGuid(),
				Label = obj.Label,
				User = obj.User
			};
		}

		public override TodoEntity Convert(Todo obj)
		{
			return new TodoEntity
			{
				Checked = obj.Checked,
				Id = obj.Id.AsObjectId(),
				Label = obj.Label,
				User = obj.User
			};
		}
	}
}