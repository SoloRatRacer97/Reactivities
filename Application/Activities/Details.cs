using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
      public class Details
    {
        public class Query : IRequest<Result<ActivityDto>>
        {
            public Guid Id { get; set; }
        }
            public class Handler : IRequestHandler<Query, Result<ActivityDto>>
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
                    // Recall: Need to make this an async when dealing with HTTP verbs.
                  public async Task<Result<ActivityDto>> Handle(Query request, CancellationToken cancellationToken)
                  {
                        // Returning the id to the request from the query that we set up above from IRequest with Medaitor
                        var activity = await _context.Activities
                              .ProjectTo<ActivityDto>(_mapper.ConfigurationProvider, new{currentUsername = _userAccessor.GetUsername()})
                              .FirstOrDefaultAsync(x => x.Id == request.Id);

                        // We only need to pass it success here. Since we are definitely returning something from the results object, either the activity or null, we will always be getting something back. If we encounter a null, it will just alert the browser of it. From here, we will need to test the result in our activities controller. 
                        return Result<ActivityDto>.Success(activity);
                  }
            }
      }
}