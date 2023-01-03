// I think SignalR is what will be sending back requests from our database for the chat feature. Not sure on the specifics of it though...

using Application.Comments;
using MediatR;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR
{
      public class ChatHub : Hub
      {
            private readonly IMediator _mediator;
            public ChatHub(IMediator mediator)
            {
                _mediator = mediator;
            }
            public async Task SendComment(Create.Command command)
            {
                var comment = await _mediator.Send(command);
                // Sending the comment back to the group
                await Clients.Group(command.ActivityId.ToString())
                    .SendAsync("RecieveComment", comment.Value);
            }
            public override async Task OnConnectedAsync()
            {
                // Using the httpContext to get the comment info
                var httpContext = Context.GetHttpContext();
                // Grabbing the Id from the cotnext
                var activityId = httpContext.Request.Query["activityId"];
                // Adding the context to the group when we connect?:
                await Groups.AddToGroupAsync(Context.ConnectionId, activityId);
                // Just grabbing the result list with mediator and the activityId
                var result = await _mediator.Send(new List.Query{ActivityId = Guid.Parse(activityId)});
                // Sending the result back:
                await Clients.Caller.SendAsync("LoadComments", result.Value);
            }
      }
}