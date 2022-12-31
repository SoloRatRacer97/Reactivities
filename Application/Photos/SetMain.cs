// Handler to set the photo as main

using Application.Core;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Photos
{
    public class SetMain
    {
        public class Command : IRequest<Result<Unit>>
        {
            public string Id { get; set; }
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

                public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
                {
                    // Getting the user:
                  var user = await _context.Users.Include(p => p.Photos).FirstOrDefaultAsync(x => x.UserName == _userAccessor.GetUsername());
                    // Returning null if the user is null:
                  if (user == null) return null;
                    // Getting photo from the request:
                  var photo = user.Photos.FirstOrDefault(x => x.Id == request.Id);
                    // Retuning null if photo is null:
                  if (photo == null) return null;
                    // Temp var. for currentMain photo storage:
                  var currentMain = user.Photos.FirstOrDefault(x => x.IsMain);
                    // Ensuring current main is set to main
                  if (currentMain != null) currentMain.IsMain = false;
                    // Setting the request photo to main:
                  photo.IsMain = true;
                    // Createing a success varaible for saving the changes into the database
                  var success = await _context.SaveChangesAsync() > 0;
                    // Return the success result if succeeded
                  if (success) return Result<Unit>.Success(Unit.Value);
                    // Otherwise, returning a failute and sending a message:
                  return Result<Unit>.Failure("Problem setting main photo");
                }
            }
      }
}