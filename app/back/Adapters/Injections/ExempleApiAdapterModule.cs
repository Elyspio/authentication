using Authentication.Api.Abstractions.Interfaces.Injections;
using Authentication.Api.Adapters.Configs;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Authentication.Api.Adapters.Injections;

public class AdapterModule : IDotnetModule
{
	public void Load(IServiceCollection services, IConfiguration configuration)
	{
		var conf = new EndpointConfig();
		configuration.GetSection(EndpointConfig.Section).Bind(conf);
}
}