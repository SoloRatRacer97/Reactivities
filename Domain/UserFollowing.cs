// Setting up a join entity for our many to many realtionship for the following feature

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Domain
{
    public class UserFollowing
    {
        // This way of naming things is a bit simpler than naming followers and following. Instead, we will leave it a bit more implicit and call them targets and observers
        public string ObserverId { get; set; }
        public AppUser Observer { get; set; }
        public string TargetId { get; set; }
        public AppUser Target { get; set; }
    }
}