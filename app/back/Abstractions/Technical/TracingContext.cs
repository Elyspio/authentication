using Authentication.Api.Abstractions.Helpers;
using Microsoft.Extensions.Logging;
using System.Diagnostics;
using System.Runtime.CompilerServices;

namespace Authentication.Api.Abstractions.Technical;

public class TracingContext
{
	private static readonly Dictionary<string, ActivitySource> _sources = new();
	private readonly ILogger _logger;
	private readonly string _sourceName;


	protected TracingContext(ILogger logger)
	{
		_logger = logger;
		_sourceName = GetType().Name;
		if (!_sources.ContainsKey(_sourceName)) _sources.Add(_sourceName, new(_sourceName));
	}

	private ActivitySource ActivitySource => _sources[_sourceName];


	protected Log.LoggerInstance LogService(string arguments = "", [CallerMemberName] string method = "", [CallerFilePath] string fullFilePath = "")
	{
		method = GetMethodName(method);

		var className = Log.GetClassNameFromFilepath(fullFilePath);
		var activity = ActivitySource.StartActivity($"{className}.{method}");

		return _logger.Enter(arguments, LogLevel.Debug, activity, method);
	}

	protected Log.LoggerInstance LogController(string arguments = "", [CallerMemberName] string method = "", [CallerFilePath] string fullFilePath = "")
	{
		method = GetMethodName(method);

		var className = Log.GetClassNameFromFilepath(fullFilePath);
		var activity = ActivitySource.StartActivity($"{className}.{method}");

		return _logger.Enter(arguments, LogLevel.Information, activity, method);
	}

	protected Log.LoggerInstance LogAdapter(string arguments = "", [CallerMemberName] string method = "", [CallerFilePath] string fullFilePath = "")
	{
		method = GetMethodName(method);

		var className = Log.GetClassNameFromFilepath(fullFilePath);
		var activity = ActivitySource.StartActivity($"{className}.{method}");

		return _logger.Enter(arguments, LogLevel.Debug, activity, method);
	}


	private string GetMethodName(string rawMethodName)
	{
		if (rawMethodName == ".ctor") rawMethodName = "Constructor";
		return rawMethodName;
	}
}