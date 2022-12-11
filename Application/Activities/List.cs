using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Persistence;

namespace Application.Activities
{
      public class List
    {
        public class Query : IRequest<List<Activity>> {}

            public class Handler : IRequestHandler<Query, List<Activity>>
            {

                
                private readonly DataContext _context;
                public Handler(DataContext context)
                {
                  _context = context;
                    
                }
                // Returning a list of activities:
                  public async Task<List<Activity>> Handle(Query request, CancellationToken token)
                  {
                        return await _context.Activities.ToListAsync();
                  }
            }
      }
}