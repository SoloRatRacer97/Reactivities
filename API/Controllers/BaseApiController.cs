using Application.Core;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    // Note that this ApiController automatically generates errors for us upon bad requests. Very helpful
    [ApiController]
    [Route("api/[controller]")]
    public class BaseApiController : ControllerBase
    {
        // Recall: Private = only usable in this class
        private IMediator _mediator;

        // Recall: Protected = only usable in this class and any derived class
        
        // Here we are setting a glabal variable to _mediator and assigning it the mediator methods. This way, we do not have to initalize _mediator for every request in our controllers and we can just set it up here once. DRY.

        // NOTE: ??= means that if the former value is null, we it to what comes after this operator
        protected IMediator Mediator => _mediator ??= HttpContext.RequestServices.GetService<IMediator>();

        protected ActionResult HandleResult<T>(Result<T> result)
        {
            if (result == null) return NotFound();
            if (result.IsSuccess && result.Value != null)
                return Ok(result.Value);
            if (result.IsSuccess && result.Value == null)
                return NotFound();
            return BadRequest(result.Error);
        }
    }
}