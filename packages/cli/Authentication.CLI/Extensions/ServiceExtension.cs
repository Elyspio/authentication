using Authentication.CLI.AuthenticationApi;
using Authentication.CLI.Services;
using Microsoft.Extensions.DependencyInjection;

namespace Authentication.CLI.Extensions
{
    public static class ServiceExtension
    {
        public static IServiceCollection UseCustomAuthentication(this IServiceCollection services, string authenticationHost)
        {


            services.AddHttpClient<IAuthenticationClient, AuthenticationClient>(client =>
            {
                client.BaseAddress = new Uri(authenticationHost);
            });

            services.AddSingleton<AuthenticationCliService>();

            return services;

        }
    }
}
