using Authentication.CLI.AuthenticationApi;
using Spectre.Console;

namespace Authentication.CLI.Services
{
    public class AuthenticationCliService
    {
        private readonly IAuthenticationClient client;

        public AuthenticationCliService(IAuthenticationClient client)
        {
            this.client = client;
        }


        public async Task<string> Login()
        {
            var name = AnsiConsole.Ask<string>("What's your [green]login[/]?" , "user");

            var password = AnsiConsole.Prompt(
                new TextPrompt<string>("Enter [red]password[/]?")
                    .Secret());


            var ownHash = CreateMD5(name + password);

            var salt = (await client.LoginInitAsync(new PostLoginInitRequest { Name = name })).Salt;

            var hash = CreateMD5(ownHash + salt);

            var ret = await client.LoginAsync(new PostLoginRequest { Name = name, Hash = hash });



            return ret.Token;
        }

        public static string CreateMD5(string input)
        {
            // Use input string to calculate MD5 hash
            using (System.Security.Cryptography.MD5 md5 = System.Security.Cryptography.MD5.Create())
            {
                byte[] inputBytes = System.Text.Encoding.ASCII.GetBytes(input);
                byte[] hashBytes = md5.ComputeHash(inputBytes);

                return Convert.ToHexString(hashBytes).ToLower(); // .NET 5 +
            }
        }
    }
}
