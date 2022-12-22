using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;


// This is a "Data tranasfer object". This is just a data object that carries data between processes..? Are we going to be using this to match the data coming from the front end into something like an interface...? Is this a shell...?
namespace API.DTOs
{
    public class UserDto
    {
        public string DisplayName { get; set; }
        public string Token { get; set; }
        public string Image { get; set; }
        public string Username { get; set; }
    }
}