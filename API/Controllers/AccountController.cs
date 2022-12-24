using System.Security.Claims;
using API.DTOs;
using API.Services;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    // Note that we are not using Mediator in this part of the application. Again, not super sure why... See 133 for more detail?
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
            private readonly UserManager<AppUser> _userManager;
            private readonly TokenService _tokenService;
        public AccountController(UserManager<AppUser> userManager, TokenService tokenService)
        {
            _tokenService = tokenService;
            _userManager = userManager;
        }
        
        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            // Using the email for the user "id"
            var user = await _userManager.FindByEmailAsync(loginDto.Email);

            // Returning unauthorized if it can be found
            if (user == null) return Unauthorized();

            // This is going to check whether or not the password was in the database or not. 
            var result = await _userManager.CheckPasswordAsync(user, loginDto.Password);

            // If the password for that use IS in the database, return the user's info:
            if (result)
            {
                return CreateUserObject(user);
            }

            return Unauthorized();
        }
        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            if (await _userManager.Users.AnyAsync(x => x.UserName == registerDto.Username))
            {
                return BadRequest("Username is already taken");
            }

            if (await _userManager.Users.AnyAsync(x => x.Email == registerDto.Email))
            {
                return BadRequest("That email is already taken");
            }

            var user = new AppUser 
            {
                DisplayName = registerDto.DisplayName,
                Email = registerDto.Email,
                UserName = registerDto.Username
            };

            var result = await _userManager.CreateAsync(user, registerDto.Password);

            if (result.Succeeded)
                  {
                    return CreateUserObject(user);
                  }

                  return BadRequest(result.Errors);
        }
        
        [Authorize]
        [HttpGet]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            var user = await _userManager.FindByEmailAsync(User.FindFirstValue(ClaimTypes.Email));

            return CreateUserObject(user);
        }
        private UserDto CreateUserObject(AppUser user)
            {
                  return new UserDto
                  {
                        DisplayName = user.DisplayName,
                        Image = null,
                        Token = _tokenService.CreateToken(user),
                        Username = user.UserName
                  };
            }
    }
}