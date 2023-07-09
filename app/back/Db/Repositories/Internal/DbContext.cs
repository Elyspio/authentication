using Microsoft.Extensions.Configuration;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Conventions;
using MongoDB.Driver;
using MongoDB.Driver.Core.Extensions.DiagnosticSources;

namespace Authentication.Api.Db.Repositories.Internal;

public class MongoContext
{
	static MongoContext()
	{
		var pack = new ConventionPack
		{
			new EnumRepresentationConvention(BsonType.String),
			new CamelCaseElementNameConvention()
		};
		ConventionRegistry.Register("EnumStringConvention", pack, _ => true);
	}

	public MongoContext(IConfiguration configuration)
	{
		var connectionUri = new MongoUrl(configuration["Database"]);

		var clientSettings = MongoClientSettings.FromUrl(connectionUri);

		clientSettings.ClusterConfigurator = cb => cb.Subscribe(new DiagnosticsActivityEventSubscriber(new()
		{
			CaptureCommandText = true
		}));

		var client = new MongoClient(clientSettings);

		MongoDatabase = client.GetDatabase(connectionUri.DatabaseName);
	}

	/// <summary>
	///     Récupération de la IMongoDatabase
	/// </summary>
	/// <returns></returns>
	public IMongoDatabase MongoDatabase { get; }
}