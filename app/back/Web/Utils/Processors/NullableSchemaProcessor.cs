using NJsonSchema;
using NJsonSchema.Generation;

namespace Authentication.Api.Web.Utils.Processors;

/// <inheritdoc />
public class NullableSchemaProcessor : ISchemaProcessor
{
	/// <inheritdoc />
	public void Process(SchemaProcessorContext context)
	{
		foreach (var (_, prop) in context.Schema.Properties)
		{
			var nullable = prop.IsNullable(SchemaType.OpenApi3);
			prop.IsRequired = !nullable;
			prop.IsNullableRaw = nullable;
		}
	}
}