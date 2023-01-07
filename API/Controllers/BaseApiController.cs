using API.Extensions;
using Application.Core;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    // Note that this ApiController automatically generates errors for us upon bad requests. Very helpful
    [ApiController]
    // This is the base route that everything will be built on top of:
    [Route("api/[controller]")]

    // Then again, deriving the context from the ControllerBase
    public class BaseApiController : ControllerBase
    {
        // Recall: Private = only usable in this class
        private IMediator _mediator;

        // Recall: Protected = only usable in this class and any derived class
        
        // Here we are setting a glabal variable to _mediator and assigning it the mediator methods. This way, we do not have to initalize _mediator for every request in our controllers and we can just set it up here once. DRY.

        // NOTE: ??= means that if the former value is null, we it to what comes after this operator
        protected IMediator Mediator => _mediator ??= HttpContext.RequestServices.GetService<IMediator>();

        // Making a handler for the result after we check if the result exists and what the value is. 
        // Again, we are always returning something because of the results object. Then, we use mediator and this ApiController to do something with the response depending on what we get back.
        protected ActionResult HandleResult<T>(Result<T> result)
        {
            if (result == null) return NotFound();
            if (result.IsSuccess && result.Value != null)
                return Ok(result.Value);
            if (result.IsSuccess && result.Value == null)
                return NotFound();
            return BadRequest(result.Error);
        }
        // Adding a handler for the pagination header:
        protected ActionResult HandlePagedResult<T>(Result<PagedList<T>> result)
        {
            if (result == null) return NotFound();
            if (result.IsSuccess && result.Value != null)
            {
                Response.AddPaginationHeader(result.Value.CurrentPage, result.Value.PageSize,
                    result.Value.TotalCount, result.Value.TotalPages);
                return Ok(result.Value);
            }
            if (result.IsSuccess && result.Value == null)
                return NotFound();
            return BadRequest(result.Error);
        }
    }
}