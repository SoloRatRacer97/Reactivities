using Application.Activities;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Controllers
{
    public class ActivitiesController : BaseApiController
    {

        [HttpGet] //api/activities
        public async Task<ActionResult<List<Activity>>> GetActivities()
        {
            // Here we are using the Mediator glabal variable that we set in the BaseApiController class
            return await Mediator.Send(new List.Query());
        }

        [HttpGet("{id}")] //api/activities/___uuid___
        public async Task<ActionResult<Activity>> GetActivity(Guid id)
        {
            // Here we are sending the details where the id fo that task is equal to the id we found and returned in the details class.
            return await Mediator.Send(new Details.Query{Id = id});
        }

        // NOTE: We do not need to tell C# that we are creating an activity...? It just knows by looking at the interface that we defined for it earlier..? LEsson 36 @ about 6:30.
        [HttpPost]
        // This is a: Task; Returns: IActionResult; Called: CreateActivity; That takes this as an input: Activity called activity
        public async Task<IActionResult> CreateActivity(Activity activity)
        {
            // Then returning a new activity from mediator
            return Ok(await Mediator.Send(new Create.Command {Activity = activity}));
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> EditActivity(Guid id, Activity activity)
        {
            activity.Id = id;

            return Ok(await Mediator.Send(new Edit.Command{Activity = activity}));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteActivity(Guid id)
        {
            return Ok(await Mediator.Send(new Delete.Command{Id = id}));
        }
    }
}