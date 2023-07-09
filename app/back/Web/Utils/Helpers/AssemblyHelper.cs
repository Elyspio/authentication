using System.Reflection;

namespace Authentication.Api.Web.Utils.Helpers;

public static class AssemblyHelper
{
	public static List<string> GetClassWithInterface<TAssembly, TInterface>()
	{
		var interfaceType = typeof(TInterface);

		return GetAllAssemblyTypes<TAssembly>().Where(type => interfaceType.IsAssignableFrom(type)).Select(t => t.Name).ToList();
	}


	private static List<Type> GetAllAssemblyTypes<TAssembly>()
	{
		var mainAssembly = typeof(TAssembly).Assembly; // Get the main assembly

		var referencedAssemblies = mainAssembly.GetReferencedAssemblies()
			.Select(Assembly.Load)
			.ToList(); // Load all referenced assemblies

		referencedAssemblies.Add(mainAssembly); // Add the main assembly to the list


		return referencedAssemblies.Select(assembly => assembly.GetTypes()).SelectMany(s => s).ToList();
	}
}