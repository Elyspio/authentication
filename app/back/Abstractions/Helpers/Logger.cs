using Microsoft.Extensions.Logging;
using System.Runtime.CompilerServices;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Authentication.Api.Abstractions.Helpers;

public static class Log
{
	private static readonly JsonSerializerOptions options = new()
	{
		Converters =
		{
			new JsonStringEnumConverter()
		}
	};

	public static string F(object? value, [CallerArgumentExpression("value")] string name = "")
	{
		return $"{name}={JsonSerializer.Serialize(value, options)}";
	}


	public static LoggerInstance<T> Enter<T>(this ILogger<T> logger, string arguments = "", LogLevel level = LogLevel.Debug, [CallerMemberName] string method = "")
	{
		var loggerInstance = new LoggerInstance<T>(logger, method, arguments, level);

		loggerInstance.Enter();

		return loggerInstance;
	}


	public class LoggerInstance<T>
	{
		private readonly string _arguments;
		private readonly LogLevel _level;
		private readonly ILogger<T> _logger;
		private readonly string _method;
		private readonly DateTime _startedAt = DateTime.Now;

		public LoggerInstance(ILogger<T> logger, string method, string arguments, LogLevel level)
		{
			_arguments = arguments;
			_level = level;
			_method = method;
			_logger = logger;
		}

		public void Error(string content)
		{
			var sb = new StringBuilder($"{_method} -- {content}");
			_logger.LogError(sb.ToString());
		}

		public void Enter()
		{
			if (!_logger.IsEnabled(_level)) return;
			var sb = new StringBuilder($"{_method} -- IN");
			if (_arguments?.Length > 0) sb.Append($" -- {_arguments}");

			_logger.Log(_level, sb.ToString());
		}


		public void Exit()
		{
			if (!_logger.IsEnabled(_level)) return;
			var sb = new StringBuilder($"{_method} -- OUT");
			if (_arguments?.Length > 0) sb.Append($" -- {_arguments}");

			sb.Append($" -- {(DateTime.Now - _startedAt).Milliseconds}ms");

			_logger.Log(_level, sb.ToString());
		}

		public void Debug(string s)
		{
			if (!_logger.IsEnabled(LogLevel.Debug)) return;
			var sb = new StringBuilder($"{_method}");
			if (_arguments?.Length > 0) sb.Append($" -- {_arguments}");
			sb.Append($" -- {s}");

			_logger.LogDebug(sb.ToString());
		}
	}
}