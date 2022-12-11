using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Delete
    {
        public class Command: IRequest
        {
            public Guid Id { get; set; }
        }

            // Again, a command here since we are not returning anything and just requesting that an aciton be taken.
            public class Handler : IRequestHandler<Command>
            {
            private readonly DataContext _context;

            public Handler(DataContext context)
            {
                  _context = context;
                
            }
            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await _context.Activities.FindAsync(request.Id);
                // This is deleting iyt from memeory
                _context.Remove(activity);

                // This is saving it in memory:
                await _context.SaveChangesAsync();

                // Again, we arent retutning anything for now:
                return Unit.Value;
            }
            }
      }
}