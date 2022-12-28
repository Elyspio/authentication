using Authentication.Api.Abstractions.Exceptions;
using Authentication.Api.Abstractions.Extensions;
using Authentication.Api.Abstractions.Interfaces.Repositories;
using Authentication.Api.Abstractions.Models;
using Authentication.Api.Abstractions.Transports.Data.user;
using Authentication.Api.Db.Repositories.Internal;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using MongoDB.Driver;
using MongoDB.Driver.Linq;
using System.Net;

namespace Authentication.Api.Db.Repositories;

internal class UsersRepository : BaseRepository<UserEntity>, IUsersRepository
{
	public UsersRepository(IConfiguration configuration, ILogger<BaseRepository<UserEntity>> logger) : base(configuration, logger)
	{
		CreateIndexIfMissing(nameof(UserEntity.Username), true);
	}


	public async Task<UserEntity> Add(string username, string salt, string hash)
	{
		var roles = new List<AuthenticationRoles>
		{
			AuthenticationRoles.User
		};

		if (!await CheckIfUsersExist()) roles.Add(AuthenticationRoles.Admin);


		var entity = new UserEntity
		{
			Username = username,
			Hash = hash,
			Salt = salt,
			Credentials = new(),
			Settings = new()
			{
				Theme = SettingsType.System
			},
			Authorizations = new()
			{
				Authentication = new()
				{
					Roles = roles
				}
			}
		};

		try
		{
			await EntityCollection.InsertOneAsync(entity);
		}
		catch (MongoWriteException e)
		{
			if (e.WriteError.Category != ServerErrorCategory.DuplicateKey) throw;

			throw new HttpException(HttpStatusCode.Conflict, $"Username {username} is already taken", e);
		}

		return entity;
	}

	public async Task<UserEntity?> Get(Guid id)
	{
		return await EntityCollection.AsQueryable().FirstOrDefaultAsync(u => u.Id == id.AsObjectId());
	}

	public async Task<UserEntity?> Get(string username)
	{
		return await EntityCollection.AsQueryable().FirstOrDefaultAsync(u => u.Username == username);
	}

	public async Task Update(UserEntity user)
	{
		var update = Builders<UserEntity>.Update
			.Set(u => u.Disabled, user.Disabled)
			.Set(u => u.Settings, user.Settings)
			.Set(u => u.Authorizations, user.Authorizations)
			.Set(u => u.Credentials, user.Credentials)
			.Set(u => u.LastConnection, user.LastConnection)
			.Set(u => u.LastConnection, user.LastConnection);

		await EntityCollection.UpdateOneAsync(u => u.Id == user.Id, update);
	}

	public async Task<bool> CheckIfUsersExist()
	{
		return await EntityCollection.AsQueryable().AnyAsync();
	}

	public async Task<List<UserEntity>> GetAll()
	{
		return await EntityCollection.AsQueryable().ToListAsync();
	}

	public async Task Delete(Guid id)
	{
		await EntityCollection.DeleteOneAsync(u => u.Id == id.AsObjectId());
	}
}