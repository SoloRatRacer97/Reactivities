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
                var activity = await _context.Activities.FindAsync(request.Id);

                if (activity == null) return null;

                // This is deleting iyt from memeory
                _context.Remove(activity);

                // This is saving it in memory:
                var result = await _context.SaveChangesAsync() > 0;

                if (!result) return Result<Unit>.Failure("Failed to delete the activity");

                // Again, we arent retutning anything for now:
                return Result<Unit>.Success(Unit.Value);
            }
            }
      }
}