using Authentication.Api.Db.Configs;
using Microsoft.Extensions.Configuration;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.Conventions;
using MongoDB.Driver;

namespace Authentication.Api.Db.Repositories.Internal;

public class MongoContext
{
	public MongoContext(IConfiguration configuration)
	{
		var conf = new DbConfig();

		var connectionString = configuration["Database"];

		var url = new MongoUrl(connectionString);
		var client = new MongoClient(url);

		Console.WriteLine($"Connecting to Database '{url.DatabaseName}'");

		MongoDatabase = client.GetDatabase(url.DatabaseName);

		var pack = new ConventionPack
		{
			new EnumRepresentationConvention(BsonType.String),
			new CamelCaseElementNameConvention()
		};
		ConventionRegistry.Register("EnumStringConvention", pack, _ => true);
	}

	/// <summary>
	///     Récupération de la IMongoDatabase
	/// </summary>
	/// <returns></returns>
	public IMongoDatabase MongoDatabase { get; }
}