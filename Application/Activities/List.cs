using Application.Core;
using Application.Interfaces;
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
        public class Query : IRequest<Result<PagedList<ActivityDto>>> {
            public ActivityParams Params { get; set; }
        }

            public class Handler : IRequestHandler<Query, Result<PagedList<ActivityDto>>>
            {

                  private readonly IMapper _mapper;
                  
                  private readonly DataContext _context;

                  private readonly IUserAccessor _userAccessor;
                public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
                {
                  _mapper = mapper;
                  _context = context;
                  _userAccessor = userAccessor;
                    
                }
                // Returning a list of activities:
                  public async Task<Result<PagedList<ActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
                  {
                        // Here we are adding functionality to retrun the attendees, and the app user as well as the cancellationToken.
                        var query = _context.Activities
                              // For ordering by Date:
                              .Where(d => d.Date >= request.Params.StartDate)
                                    .OrderBy(d => d.Date)
                              // Adding in this project to allows us to only return data from the database that we NEED. Before this, we were sending a bunch of data that we didint need in the app.
                              .ProjectTo<ActivityDto>(_mapper.ConfigurationProvider, new {currentUsername = _userAccessor.GetUsername()})
                              // Recall that we are waiting to esecute this command until we have all the available parameters.
                              .AsQueryable();

                        if (request.Params.IsGoing && !request.Params.IsHost)
                        {
                              query = query.Where(x => x.Attendees.Any(a => a.Username == _userAccessor.GetUsername()));
                        }

                        if (request.Params.IsHost && !request.Params.IsGoing)
                        {
                              query = query.Where(x => x.HostUsername == _userAccessor.GetUsername());
                        }

                        return Result<PagedList<ActivityDto>>.Success(
                              await PagedList<ActivityDto>.CreateAsync(query, request.Params.PageNumber, request.Params.PageSize)
                        );
                  }
            }
      }
}