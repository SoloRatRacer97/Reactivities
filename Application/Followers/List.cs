// Creating a query for our followers list
// NOTE: Profile is part of Automapper AND Application here so we needed to specifiy that we wanted profiles.profile to access the correct one.

using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Followers
{
    public class List
    {
        public class Query : IRequest<Result<List<Profiles.Profile>>>
        {
            public string Predicate { get; set; }
            public string Username { get; set; }
        }

            public class Handler : IRequestHandler<Query, Result<List<Profiles.Profile>>>
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

                  public async Task<Result<List<Profiles.Profile>>> Handle(Query request, CancellationToken cancellationToken)
                  {
                    var profiles = new List<Profiles.Profile>();
                    // Setting up a switch statement for sending differenet requests. Not sure why...?
                    // Review this at 226.
                        switch (request.Predicate)
                        {
                            case "followers":
                                profiles = await _context.UserFollowings.Where(x => x.Target.UserName == request.Username)
                                    .Select(u => u.Observer)
                                    .ProjectTo<Profiles.Profile>(_mapper.ConfigurationProvider, 
                                        // Bug below:
                                        new {currentUsername = _userAccessor.GetUsername()})
                                    .ToListAsync();
                                break;
                            case "following":
                                profiles = await _context.UserFollowings.Where(x => x.Observer.UserName == request.Username)
                                    .Select(u => u.Target)
                                    .ProjectTo<Profiles.Profile>(_mapper.ConfigurationProvider, 
                                        // Bug below:
                                        new {currentUsername = _userAccessor.GetUsername()})
                                    .ToListAsync();
                                break;
                        }

                    return Result<List<Profiles.Profile>>.Success(profiles);
                  }
            }
      }
}