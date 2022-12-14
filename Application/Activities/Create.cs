using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
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
        // Why are we validating aginst the command vs the activity here...?
        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                // Setting up a validator using fluent validation. This is using the ActiivtyValidator class that we set up to validate each of the properties. Bascially, checking for non null values.
                RuleFor(x => x.Activity).SetValidator(new ActiviityValidator());
            }
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

                var user = await _context.Users.FirstOrDefaultAsync(x => x.UserName == _userAccessor.GetUsername());

                // This sets the new attendee to the activity by default since no one would create an activity and not be attending it themselves as the host.
                var attendee = new ActivityAttendee
                {
                    AppUser = user,
                    Activity = request.Activity,
                    IsHost = true
                };

                // Adding them to the activity after they were created from above
                request.Activity.Attendees.Add(attendee);

                // This saves the changes in memory first:
                _context.Activities.Add(request.Activity);

                // This actually returns an integer of the number of entities it saved to the database. So, if none are saved, it returns false.
                var result = await _context.SaveChangesAsync() > 0;

                // Then, if it is false, send back a failure with the result:
                if (!result) return Result<Unit>.Failure("Failed to create activity");

                // Else, return success and send the value which is nothing, but it will let our API know that this was successful.
                // What value are we sending....? A null...?
                return Result<Unit>.Success(Unit.Value);
            }
        }
      }
}