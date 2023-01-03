// Create handler for the comments. 
// 1) Ensures the comment is not empty

using Application.Core;
using Application.Interfaces;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Comments
{
    public class Create
    {
        public class Command : IRequest<Result<CommentDto>>
        {
            public string Body { get; set; }
            public Guid ActivityId { get; set; }
        }

            public class CommandValidator : AbstractValidator<Command>
            {
                // Ensuring the comment is not empty:
                  public CommandValidator()
                  {
                    RuleFor(x => x.Body).NotEmpty();
                  }
            }
            public class Handler : IRequestHandler<Command, Result<CommentDto>>
            {
                private readonly DataContext _context;
                private readonly IMapper _mapper;
                private readonly IUserAccessor _userAccessor;
                  public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
                  {
                    _userAccessor = userAccessor;
                    _mapper = mapper;
                    _context = context;
                  }

                  public async Task<Result<CommentDto>> Handle(Command request, CancellationToken cancellationToken)
                  {
                    // Grabbing the current user:
                    var activity = await _context.Activities.FindAsync(request.ActivityId);
                    // If current user is null, return null
                    if (activity == null) return null;

                    var user = await _context.Users
                        .Include(p => p.Photos)
                        .SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetUsername());
                        
                    // Creating a new comment:
                    var comment = new Comment
                    {
                        Author = user,
                        Activity = activity,
                        Body = request.Body
                    };
                    // Adding the comment to the activity:
                    activity.Comments.Add(comment);
                    // Variable to check if it was successful:
                    var success = await _context.SaveChangesAsync() > 0;
                    // If successful, we can return the comemnt DTO:
                    if (success) return Result<CommentDto>.Success(_mapper.Map<CommentDto>(comment));
                    // If not, then we got an error and need to throw it back:
                    return Result<CommentDto>.Failure("Failed to add comment");
                  }
            }
      }
}