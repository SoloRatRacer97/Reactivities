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

                        return Result<Activity>.Success(activity);
                  }
            }
      }
}