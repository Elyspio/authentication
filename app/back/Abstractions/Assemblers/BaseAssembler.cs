﻿using Authentication.Api.Abstractions.Extensions;
using Authentication.Api.Abstractions.Interfaces.Assemblers;
using Mapster;
using MongoDB.Bson;

namespace Authentication.Api.Abstractions.Assemblers;

public abstract class BaseAssembler<TA, TB> : IAssembler<TA, TB>
{
	static BaseAssembler()
	{
		TypeAdapterConfig.GlobalSettings.ForType<Guid, ObjectId>().MapWith(id => id.AsObjectId());
		TypeAdapterConfig.GlobalSettings.ForType<ObjectId, Guid>().MapWith(id => id.AsGuid());
	}

	public abstract TB Convert(TA obj);

	public abstract TA Convert(TB obj);


	public IEnumerable<TB> Convert(IEnumerable<TA> objs)
	{
		return objs.Select(Convert).ToList();
	}

	public IEnumerable<TA> Convert(IEnumerable<TB> objs)
	{
		return objs.Select(Convert).ToList();
	}


	public async Task<TB> Convert(Task<TA> obj)
	{
		var data = await obj;
		return Convert(data);
	}

	public async Task<TA> Convert(Task<TB> obj)
	{
		var data = await obj;
		return Convert(data);
	}

	public List<TB> Convert(List<TA> objs)
	{
		return objs.Select(Convert).ToList();
	}

	public List<TA> Convert(List<TB> objs)
	{
		return objs.Select(Convert).ToList();
	}
}