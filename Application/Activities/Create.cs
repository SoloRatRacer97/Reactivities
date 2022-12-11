using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Create
    {
        // Recall that quieries return data, commands do not. So our create class is a command
        public class Command : IRequest
        {
            // We are recieving this from our API:
            public Activity Activity { get; set; }
        }
        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }
                public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                // This saves the changes in memory first:
                _context.Activities.Add(request.Activity);

                // Here we save the cahges into SQLite
                await _context.SaveChangesAsync();
                // We just need to give a return value here so the method is happy?
                return Unit.Value;
            }
        }
      }
}