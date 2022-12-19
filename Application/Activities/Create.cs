using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using Domain;
using FluentValidation;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Create
    {
        // Recall that quieries return data, commands do not. So our create class is a command
        public class Command : IRequest<Result<Unit>>
        {
            // We are recieving this from our API:
            public Activity Activity { get; set; }
        }
        // Setting up our validator. We are validating aginst the Command here in this case. Is it because the data will be in the request from our activity...? Why not keep it as activity here?
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
            public Handler(DataContext context)
            {
                _context = context;
            }
                public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                // This saves the changes in memory first:
                _context.Activities.Add(request.Activity);

                // This actually returns an integer of the number of entities it saved to the database. So, if none are saved, it returns false.
                var result = await _context.SaveChangesAsync() > 0;

                // Then, if it is false, send back a failure with the result:
                if (!result) return Result<Unit>.Failure("Failed to create activity");

                return Result<Unit>.Success(Unit.Value);
            }
        }
      }
}