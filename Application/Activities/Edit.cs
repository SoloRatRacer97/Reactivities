using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Domain;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Edit
    {
        public class Command : IRequest
        {
            public Activity Activity { get; set; }
        }

            public class Handler : IRequestHandler<Command>
            {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
                  public Handler(DataContext context, IMapper mapper)
                  {
                    _mapper = mapper;
                    _context = context;

                  }

                  public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
                  {
                    // Get the activty by Id
                    var activity = await _context.Activities.FindAsync(request.Activity.Id);
                    // Updating the title only. We ill use AutoMapper here soon to not repeat outselves.
                    // activity.Title = request.Activity.Title ?? activity.Title;
                    // Save the changes into SQLite.

                    // Using automapper for the data now:
                    _mapper.Map(request.Activity, activity);

                    await _context.SaveChangesAsync();
                    
                    // Again, we are retuning Unit.value since we are not reallllly returnign anything here since we are just updating the data.
                    return Unit.Value;
                  }
            }
      }
}