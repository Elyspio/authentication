using Authentication.Api.Abstractions.Transports.user;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Authentication.Api.Abstractions.Models;

public class UserEntity : UserBase
{
	[BsonId]
	[BsonRepresentation(BsonType.ObjectId)]
	public ObjectId Id { get; init; }

}