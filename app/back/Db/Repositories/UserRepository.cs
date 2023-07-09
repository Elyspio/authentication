using Authentication.Api.Abstractions.Exceptions;
using Authentication.Api.Abstractions.Extensions;
using Authentication.Api.Abstractions.Helpers;
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
	public UsersRepository(IConfiguration configuration, ILogger<UsersRepository> logger) : base(configuration, logger)
	{
		using var _ = LogAdapter();

		CreateIndexIfMissing(nameof(UserEntity.Username), true);
	}


	public async Task<UserEntity> Add(string username, string salt, string hash)
	{
		using var _ = LogAdapter($"{Log.F(username)}");

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
				Videyo = new()
				{
					Roles = new()
				},
				Authentication = new()
				{
					Roles = roles
				},
				SousMarinJaune = new()
				{
					Roles = new()
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
		using var _ = LogAdapter($"{Log.F(id)}");

		return await EntityCollection.AsQueryable().FirstOrDefaultAsync(u => u.Id == id.AsObjectId());
	}

	public async Task<UserEntity?> Get(string username)
	{
		using var _ = LogAdapter($"{Log.F(username)}");

		return await EntityCollection.AsQueryable().FirstOrDefaultAsync(u => u.Username == username);
	}

	public async Task Update(UserEntity user)
	{
		using var _ = LogAdapter($"{Log.F(user.Id)}");

		var update = Builders<UserEntity>.Update
			.Set(u => u.Disabled, user.Disabled)
			.Set(u => u.Settings, user.Settings)
			.Set(u => u.Authorizations, user.Authorizations)
			.Set(u => u.Credentials, user.Credentials)
			.Set(u => u.LastConnection, user.LastConnection);

		await EntityCollection.UpdateOneAsync(u => u.Id == user.Id, update);
	}

	public async Task<bool> CheckIfUsersExist()
	{
		using var _ = LogAdapter();

		return await EntityCollection.AsQueryable().AnyAsync();
	}

	public async Task<List<UserEntity>> GetAll()
	{
		using var _ = LogAdapter();

		return await EntityCollection.AsQueryable().ToListAsync();
	}

	public async Task Delete(Guid id)
	{
		using var _ = LogAdapter($"{Log.F(id)}");
		
		await EntityCollection.DeleteOneAsync(u => u.Id == id.AsObjectId());
	}

	public async Task ChangePassword(string username, string salt, string hash)
	{
		using var _ = LogAdapter($"{Log.F(username)}");

		var update = Builders<UserEntity>.Update
			.Set(u => u.Hash, hash)
			.Set(u => u.Salt, salt);

		await EntityCollection.UpdateOneAsync(u => u.Username == username, update);
	}
}