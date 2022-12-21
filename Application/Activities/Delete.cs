using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Delete
    {
        public class Command: IRequest<Result<Unit>>
        {
            public Guid Id { get; set; }
        }

            // Again, a command here since we are not returning anything and just requesting that an aciton be taken.
            public class Handler : IRequestHandler<Command, Result<Unit>>
            {
            private readonly DataContext _context;

            public Handler(DataContext context)
            {
                  _context = context;
                
            }
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                // Finding the actiivty from the database
                var activity = await _context.Activities.FindAsync(request.Id);
                // If it doesnt exist, return null. Makes sense.
                if (activity == null) return null;

                // This is deleting it from working memeory, I think.
                _context.Remove(activity);

                // Creating a result varibale to see if any changes are saved.
                var result = await _context.SaveChangesAsync() > 0;

                // If changes are to be saved and result is false, then return the failure.
                if (!result) return Result<Unit>.Failure("Failed to delete the activity");

                // Again, we arent retutning anything for now since if we deleted something, we dont need ot return it back. Just let the front end know that it was OK.
                return Result<Unit>.Success(Unit.Value);
            }
            }
      }
}