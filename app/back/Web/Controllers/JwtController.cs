using Authentication.Api.Abstractions.Interfaces.Services;
using Authentication.Api.Abstractions.Transports.Responses;
using Microsoft.AspNetCore.Mvc;
using NSwag.Annotations;
using System.Net;
using Authentication.Api.Abstractions.Transports.Data.user;
using Authentication.Api.Web.Filters;
using Authentication.Api.Web.Utils;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Authentication.Api.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class JwtController : ControllerBase
    {

        private readonly ITokenService _tokenService;

        public JwtController(ITokenService tokenService)
        {
            _tokenService = tokenService;
        }


        /// <summary>
        ///     Verify if Jwt is still valid
        /// </summary>
        /// <returns>a JWT for this user</returns>
        [HttpGet("verify")]
        [SwaggerResponse(HttpStatusCode.OK, typeof(bool))]
        public IActionResult Verify()
        {
            return Ok(_tokenService.ValidateJwt(Request.Headers.Authorization.ToString(), out _));
        }


        /// <summary>
        ///     Get public RSA key used for Jwt validation
        /// </summary>
        /// <returns>a JWT for this user</returns>
        [HttpGet("validation-key")]
        [SwaggerResponse(HttpStatusCode.OK, typeof(StringResponse))]
        public IActionResult GetValidationKey()
        {
            return Ok(new StringResponse(_tokenService.GetPublicKeyRaw()));
        }


        /// <summary>
        ///     Refresh a JWT
        /// </summary>
        /// <returns>a JWT for this user</returns>
        [HttpPost("refresh")]
        [SwaggerResponse(HttpStatusCode.OK, typeof(StringResponse))]
        [Authorize(AuthenticationRoles.User)]
        public async Task<IActionResult> RefreshJwt()
        {
            var jwt = await _tokenService.RefreshJwt(AuthUtility.GetUser(Request).Id);
            return Ok(new StringResponse(jwt));
        }

    }
}
