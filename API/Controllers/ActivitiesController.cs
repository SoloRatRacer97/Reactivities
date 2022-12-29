using Application.Activities;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    // Temporarily puting this in so we can test our app as we build it. Will comment out later
    // [AllowAnonymous]
    public class ActivitiesController : BaseApiController
    {

        [HttpGet] //this is the base url from BaseApiController and sets up a route at => api/activities
        public async Task<IActionResult> GetActivities()
    {
            // Here we are using the Mediator glabal variable that we set in the BaseApiController class
            return HandleResult(await Mediator.Send(new List.Query()));
        }

        // This little flag makes this path need to be authorized to use:
        // [Authorize]
        [HttpGet("{id}")] //api/activities/___uuid___
        public async Task<IActionResult> GetActivity(Guid id)
        {
            return HandleResult(await Mediator.Send(new Details.Query{Id = id}));
        }

        // NOTE: We do not need to tell C# that we are creating an activity...? It just knows by looking at the interface that we defined for it earlier..? LEsson 36 @ about 6:30.
        [HttpPost]
        // This is a: Task; Returns: IActionResult; Called: CreateActivity; That takes this as an input: Activity called activity
        public async Task<IActionResult> CreateActivity(Activity activity)
        {
            // Then returning a new activity from mediator
            return HandleResult(await Mediator.Send(new Create.Command {Activity = activity}));
        }
        [Authorize(Policy = "IsActivityHost")]
        [HttpPut("{id}")]
        public async Task<IActionResult> EditActivity(Guid id, Activity activity)
        {
            activity.Id = id;
            return HandleResult(await Mediator.Send(new Edit.Command{Activity = activity}));
        }
        
        // Delete handler from Application => Activities
        [Authorize(Policy = "IsActivityHost")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteActivity(Guid id)
        {
            return HandleResult(await Mediator.Send(new Delete.Command{Id = id}));
        }

        // Attendance handler from Application => Activities
        [HttpPost("{id}/attend")]
        public async Task<IActionResult> Attend(Guid id)
        {
            return HandleResult(await Mediator.Send(new UpdateAttendance.Command{Id = id}));
        }
    }
}