// Toggle for following or unfollowing a user:

using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Followers
{
    public class FollowToggle
    {
        public class Command : IRequest<Result<Unit>>
        {
            public string TargetUsername { get; set; }
        }

            public class Handler : IRequestHandler<Command, Result<Unit>>
            {
                private readonly DataContext _context;
                private readonly IUserAccessor _uerAccessor;
                  public Handler(DataContext context, IUserAccessor uerAccessor)
                  {
                    _uerAccessor = uerAccessor;
                    _context = context;
                  }

                  public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
                  {
                    // The user who is following the other user:
                    var observer = await _context.Users.FirstOrDefaultAsync(x => x.UserName == _uerAccessor.GetUsername());
                    // The user who is being followed
                    var target = await _context.Users.FirstOrDefaultAsync(x => x.UserName == request.TargetUsername);

                    if (target == null) return null;
                    // Grabbing the existing following relationship between the two
                    var following = await _context.UserFollowings.FindAsync(observer.Id, target.Id);

                    // If its null, make a new one:
                    if (following == null) 
                    {
                        following = new Domain.UserFollowing 
                        {
                            Observer = observer,
                            Target = target
                        };
                        _context.UserFollowings.Add(following);
                    } 
                    // Else, toggle it back off and remove the relationship:
                    else {
                        _context.UserFollowings.Remove(following);
                    }
                    // Grabbing the success variable if it works
                    var success = await _context.SaveChangesAsync() > 0;
                    // Saving it into the databse:
                    if (success) return Result<Unit>.Success(Unit.Value);
                    // Retuning an erorr statement if it fails:
                    return Result<Unit>.Failure("Failed to update following.");

                  }
            }
      }
}