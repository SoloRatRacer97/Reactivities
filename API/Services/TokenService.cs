using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Domain;
using Microsoft.IdentityModel.Tokens;


// Note that this is not really the best way to do a secure login. For a larger build, you would wnat to use Azure 
namespace API.Services
{
    public class TokenService
    {
            private readonly IConfiguration _config;
        public TokenService(IConfiguration config)
        {   
                  _config = config;
        }
        public string CreateToken(AppUser user)
        {
            // Again, claims are what our user is sending back to us for Auth. It does NOT contain any sensative information.
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.UserName),
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Email, user.Email),
            };

            // Semetric security key:
            // A symmetric key is for when you use the same key for incryption and decyption. Later on, this will be a more compelex key than this simple one right now.
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["TokenKey"]));
            // Apparently this is the strongest one...?
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            // Setting up the token parameters:
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = creds
            };

            var tokenHandler = new JwtSecurityTokenHandler();

            // Creating a token with token handler giving it the token desctiption:
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }
    }
}