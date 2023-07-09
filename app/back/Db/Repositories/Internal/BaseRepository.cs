using Authentication.Api.Abstractions.Helpers;
using Authentication.Api.Abstractions.Technical;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.Conventions;
using MongoDB.Bson.Serialization.Serializers;
using MongoDB.Driver;

namespace Authentication.Api.Db.Repositories.Internal;

public abstract class BaseRepository<T> : TracingContext
{
	private readonly string _collectionName;
	private readonly MongoContext _context;
	private readonly ILogger<BaseRepository<T>> _logger;

	protected BaseRepository(IConfiguration configuration, ILogger<BaseRepository<T>> logger, string? collectionName = default) : base(logger)
	{
		_context = new(configuration);
		_collectionName = collectionName ?? typeof(T).Name[..^"Entity".Length].ToLower();

		if (collectionName == default && !_collectionName.EndsWith('s')) _collectionName += 's';

		_logger = logger;
		var pack = new ConventionPack
		{
			new EnumRepresentationConvention(BsonType.String),
			new CamelCaseElementNameConvention()
		};

		ConventionRegistry.Register("EnumStringConvention", pack, t => true);
		BsonSerializer.RegisterSerializationProvider(new EnumAsStringSerializationProvider());
	}

	protected IMongoCollection<T> EntityCollection => _context.MongoDatabase.GetCollection<T>(_collectionName);


	protected void CreateIndexIfMissing(string property, bool unique = false)
	{
		using var _ = LogAdapter($"{Log.F(property)} {Log.F(unique)}");
		
		var indexes = EntityCollection.Indexes.List().ToList();
		var foundIndex = indexes.Any(index => index["name"] == property);

		if (foundIndex) return;
		
		_logger.LogWarning($"Property {_collectionName}.{property} is not indexed, creating one");

		var possibleIndexes = Builders<T>.IndexKeys;
		var indexModel = new CreateIndexModel<T>(possibleIndexes.Ascending(property), new()
		{
			Unique = unique,
			Name = property
		});
		
		EntityCollection.Indexes.CreateOne(indexModel);
		_logger.LogWarning($"Property {_collectionName}.{property} is now indexed");
	}
}

public class EnumAsStringSerializationProvider : BsonSerializationProviderBase
{
	public override IBsonSerializer GetSerializer(Type type, IBsonSerializerRegistry serializerRegistry)
	{
		if (!type.IsEnum) return null;

		var enumSerializerType = typeof(EnumSerializer<>).MakeGenericType(type);
		var enumSerializerConstructor = enumSerializerType.GetConstructor(new[]
		{
			typeof(BsonType)
		});
		var enumSerializer = (IBsonSerializer) enumSerializerConstructor.Invoke(new object[]
		{
			BsonType.String
		});

		return enumSerializer;
	}
}