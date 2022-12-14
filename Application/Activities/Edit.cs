using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Edit
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Activity Activity { get; set; }
        }
        // This is the same validator for our edit handler here as the create activity:
        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Activity).SetValidator(new ActiviityValidator());
            }
        }

            public class Handler : IRequestHandler<Command, Result<Unit>>
            {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
                  public Handler(DataContext context, IMapper mapper)
                  {
                    _mapper = mapper;
                    _context = context;

                  }

                  public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
                  {
                    var activity = await _context.Activities.FindAsync(request.Activity.Id);

                    if (activity == null) return null;

                    _mapper.Map(request.Activity, activity);

                    // Checking to make sure the number of results is greater than 0:
                    var result = await _context.SaveChangesAsync() > 0;
                    
                    if (!result) return Result<Unit>.Failure("Failed to update activity.");

                    // Again, we are retuning Unit.value since we are not really returning anything here since we are just updating the data. We just want to let it know what we did it. 
                    return Result<Unit>.Success(Unit.Value);
                  }
            }
      }
}