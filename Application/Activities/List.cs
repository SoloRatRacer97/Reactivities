using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Persistence;

namespace Application.Activities
{
      public class List
    {
        public class Query : IRequest<Result<List<ActivityDto>>> {}

            public class Handler : IRequestHandler<Query, Result<List<ActivityDto>>>
            {

            private readonly IMapper _mapper;
                
            private readonly DataContext _context;
                public Handler(DataContext context, IMapper mapper)
                {
                  _mapper = mapper;
                  _context = context;
                    
                }
                // Returning a list of activities:
                  public async Task<Result<List<ActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
                  {
                        // Here we are adding functionality to retrun the attendees, and the app user as well as the cancellationToken.
                        var activities = await _context.Activities
                        // Adding in this project to allows us to only return data from the database that we NEED. Before this, we were sending a bunch of data that we didint need in the app.
                        .ProjectTo<ActivityDto>(_mapper.ConfigurationProvider)
                        .ToListAsync(cancellationToken);
                        
                        // I think this is mapping the activity to the activity Dto that we made... Need to review this specifically
                        // var activitiesToReturn = _mapper.Map<List<ActivityDto>>(activities);

                        return Result<List<ActivityDto>>.Success(activities);
                  }
            }
      }
}