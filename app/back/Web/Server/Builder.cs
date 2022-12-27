using Authentication.Api.Abstractions.Helpers;
using Authentication.Api.Abstractions.Interfaces.Injections;
using Authentication.Api.Adapters.Injections;
using Authentication.Api.Core.Injections;
using Authentication.Api.Db.Injections;
using Authentication.Api.Web.Filters;
using Authentication.Api.Web.Utils;
using Authentication.Api.Web.Utils.Processors;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc.Formatters;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using NJsonSchema.Generation;
using NSwag;
using Serilog;
using Serilog.Events;
using System.Net;
using System.Text;
using System.Text.Json.Serialization;

namespace Authentication.Api.Web.Server;

public class ServerBuilder
{
	private readonly string _frontPath = Env.Get("FRONT_PATH", "/front");

	public ServerBuilder(string[] args)
	{
		var builder = WebApplication.CreateBuilder(args);
		builder.WebHost.ConfigureKestrel((_, options) =>
			{
				options.Listen(IPAddress.Any, 4001, listenOptions =>
					{
						// Use HTTP/3
						listenOptions.Protocols = HttpProtocols.Http1AndHttp2;
					}
				);
			}
		);


		// Setup CORS
		builder.Services.AddCors(options =>
			{
				options.AddDefaultPolicy(b =>
					{
						b.AllowAnyOrigin();
						b.AllowAnyHeader();
						b.AllowAnyMethod();
					}
				);
			}
		);


		builder.Services.AddModule<AdapterModule>(builder.Configuration);
		builder.Services.AddModule<CoreModule>(builder.Configuration);
		builder.Services.AddModule<DatabaseModule>(builder.Configuration);


		// Setup Logging
		builder.Host.UseSerilog((_, lc) => lc
			.MinimumLevel.Debug()
			.Enrich.FromLogContext()
			.Filter.ByExcluding(@event => @event.Level == LogEventLevel.Debug && @event.Properties["SourceContext"].ToString().Contains("Microsoft.AspNetCore"))
			.WriteTo.Console(outputTemplate: "{Timestamp:yyyy-MM-dd HH:mm:ss.fff zzz} [{Level}] {SourceContext:l} -- {Message}{NewLine}{Exception}")
		);


		// Setup controllers (enum, filters)
		builder.Services.AddControllers(o =>
				{
					o.Conventions.Add(new ControllerDocumentationConvention());
					o.OutputFormatters.RemoveType<StringOutputFormatter>();
					o.Filters.Add<HttpExceptionFilter>();
				}
			)
			.AddNewtonsoftJson(x =>
			{
				x.SerializerSettings.Converters.Add(new StringEnumConverter());
				x.SerializerSettings.NullValueHandling = NullValueHandling.Ignore;
			});

		// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
		builder.Services.AddEndpointsApiExplorer();
		builder.Services.AddOpenApiDocument(document =>
		{
			document.DocumentName = "Authentication.Api";
			document.Title = "Authentication.Api";
			document.DefaultResponseReferenceTypeNullHandling = ReferenceTypeNullHandling.NotNull;
			document.SchemaProcessors.Add(new NullableSchemaProcessor());
			document.OperationProcessors.Add(new NullableOperationProcessor());
			document.AddSecurity("Bearer", new()
			{
				In = OpenApiSecurityApiKeyLocation.Header,
				Description = "Please insert JWT with Bearer into field",
				Name = "Authorization",
				Type = OpenApiSecuritySchemeType.ApiKey
			});
		});

		//JWT Authentication
		builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options =>
		{
			options.TokenValidationParameters = new()
			{
				ValidateIssuer = true,
				ValidateAudience = true,
				ValidateLifetime = true,
				ValidateIssuerSigningKey = true,
				ValidIssuer = builder.Configuration["Jwt:Issuer"],
				ValidAudience = builder.Configuration["Jwt:Audience"],
				IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
			};
		});


		// Setup SPA Serving
		if (builder.Environment.IsProduction()) Console.WriteLine($"Server in production, serving SPA from {_frontPath} folder");

		builder.Services.AddSignalR(options => { options.EnableDetailedErrors = true; })
			.AddJsonProtocol(options =>
				{
					options.PayloadSerializerOptions.IncludeFields = true;
					options.PayloadSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
					options.PayloadSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingDefault;
					options.PayloadSerializerOptions.Converters.Add(new JsonStringEnumConverter());
				}
			);


		Application = builder.Build();
	}

	public WebApplication Application { get; }
}