using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using Domain;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Details
    {
        public class Query : IRequest<Result<Activity>>
        {
            public Guid Id { get; set; }
        }
            public class Handler : IRequestHandler<Query, Result<Activity>>
            {
            private readonly DataContext _context;
                  public Handler(DataContext context)
                  {
                        _context = context;
                  }
                    // Recall: Need to make this an async when dealing with HTTP verbs.
                  public async Task<Result<Activity>> Handle(Query request, CancellationToken cancellationToken)
                  {
                        // Returning the id to the request from the query that we set up above from IRequest with Medaitor
                        var activity = await _context.Activities.FindAsync(request.Id);

                        // We only need to pass it success here. Since we are definitely returning something from the results object, either the activity or null, we will always be getting something back. If we encounter a null, it will just alert the browser of it. From here, we will need to test the result in our activities controller. 
                        return Result<Activity>.Success(activity);
                  }
            }
      }
}