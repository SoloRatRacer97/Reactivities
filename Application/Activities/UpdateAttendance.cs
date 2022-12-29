// 1) Users can remove themselves from the event
// 2) Users can join the event
// 3) If they are the host, they can cancel the activity

using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class UpdateAttendance
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Guid Id { get; set; }
        }

            public class Handler : IRequestHandler<Command, Result<Unit>>
            {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
                public Handler(DataContext context, IUserAccessor userAccessor)
                {
                  _userAccessor = userAccessor;
                  _context = context;
                    
                }
                // Cancelation method:
                public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
                {
                    var activity = await _context.Activities
                        .Include(a => a.Attendees).ThenInclude(u => u.AppUser)
                        // Note: There are two ways of getting an entity. Single, or first. In this case, we are using single becasue it will not let us return any duplicates in our database... I think. Might need to do more research on this one.
                        .SingleOrDefaultAsync(x => x.Id == request.Id);
                    if (activity == null) return null;

                    var user = await _context.Users.FirstOrDefaultAsync(x => x.UserName == _userAccessor.GetUsername());

                    if (user == null) return null;

                    var hostUsername = activity.Attendees.FirstOrDefault(x => x.IsHost)?.AppUser.UserName;

                    var attendance = activity.Attendees.FirstOrDefault(x => x.AppUser.UserName == user.UserName);

                    // If its the host, they can cancel the activity:
                    if (attendance != null && hostUsername == user.UserName)
                        activity.isCancelled = !activity.isCancelled;
                    
                    // If its a regular user, they can remove themselves:                    
                    if (attendance != null && hostUsername != user.UserName)
                        activity.Attendees.Remove(attendance);

                    // If they are not currently attending, create a new attendance for them:
                    if (attendance == null)
                    {
                        attendance = new ActivityAttendee
                        {
                            AppUser = user,
                            Activity = activity,
                            IsHost = false
                        };

                        activity.Attendees.Add(attendance);
                    }
                    var result = await _context.SaveChangesAsync() > 0;

                    return result ? Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("Problem upodating attendance");
                }
            }
      }
}