using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
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
    }
}