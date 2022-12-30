// Handler for adding photo(s)

using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System.Linq;

namespace Infrastructure.Photos
{
    public class Add
    {
        public class Command : IRequest<Result<Photo>>
        {
            public IFormFile File { get; set; }
        }

            public class Handler : IRequestHandler<Command, Result<Photo>>
            {
            private readonly DataContext _context;
            private readonly IPhotoAccessor _photoAccessor;
            private readonly IUserAccessor _userAccessor;
                  public Handler(DataContext context, IPhotoAccessor photoAccessor, IUserAccessor userAccessor)
                  {
                    _userAccessor = userAccessor;
                    _photoAccessor = photoAccessor;
                    _context = context;
                  }

                  public async Task<Result<Photo>> Handle(Command request, CancellationToken cancellationToken)
                  {
                    // Get the current user:
                    var user  = await _context.Users.Include(p => p.Photos).FirstOrDefaultAsync(x => x.UserName == _userAccessor.GetUsername());
                    // If no current user, return null:
                    if (user == null) return null;
                    // Getting the file from the request
                    var photoUploadResult = await _photoAccessor.AddPhoto(request.File);
                    // Setting up a photo with the file feeding it data:
                    var photo = new Photo
                    {
                        Url = photoUploadResult.Url,
                        Id = photoUploadResult.PublicId
                    };
                    // Setting the photo to the mnain one if its the first one being added:
                    if (!user.Photos.Any(x => x.IsMain)) photo.IsMain = true;
                    // Adding the photo to the user's collection
                    user.Photos.Add(photo);
                    // True / False if it succeeded or not
                    var result = await _context.SaveChangesAsync() > 0;
                    // If its a success, save it into the database and return:
                    if (result) return Result<Photo>.Success(photo);
                    // If not, retun an error mesasge:
                    return Result<Photo>.Failure("Problem adding photo");
                  }
            }
      }
}