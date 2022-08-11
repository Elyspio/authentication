using Authentication.CLI.Extensions;
using Authentication.CLI.Services;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Spectre.Console;

var host = Host.CreateDefaultBuilder(args)
    .ConfigureServices((ctx, service) =>
    {
        var authenticationHost = "http://localhost:4001";
        service.UseCustomAuthentication(authenticationHost);
    }
).Build();


var scope = host.Services.CreateScope();


var service = scope.ServiceProvider.GetRequiredService<AuthenticationCliService>();


var token = await service.Login();

AnsiConsole.MarkupLine($"Token: [red]{token}[/]");
