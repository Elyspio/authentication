using Authentication.Api.Abstractions.Assemblers;
using Authentication.Api.Abstractions.Models;
using Authentication.Api.Abstractions.Transports.Data;
using Mapster;

namespace Authentication.Api.Core.Assemblers;

public class UserAssembler : BaseAssembler<User, UserEntity>
{
	static UserAssembler()
	{
		TypeAdapterConfig<UserEntity, User>.ForType().Map(user => user.CreatedAt, entity => entity.Id.CreationTime);
	}

	public override User Convert(UserEntity? obj)
	{
		return obj.Adapt<User>();
	}

	public override UserEntity Convert(User obj)
	{
		return obj.Adapt<UserEntity>();
	}
}