using System.Linq;
using Application.Activities;
using AutoMapper;
using Domain;

namespace Application.Core
{
      public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            // We are mapping from the old activity to the new activity. Kind of weird, but just go with it here. 
            CreateMap<Activity, Activity>();
            // Here we are mapping the activity to the activity DTO. I think this is the actuall process that will be passing the 'bad' data through and filtering it for us to use?
            // More like mapping, than filtering. We are finding the data that we want, and then saying that it actually needs to say the new specified variable instaed. This is mapping in this context.
            CreateMap<Activity, ActivityDto>()
                .ForMember(d => d.HostUsername, o => o.MapFrom(s => s.Attendees
                    .FirstOrDefault(x => x.IsHost).AppUser.UserName));

            CreateMap<ActivityAttendee, AttendeeDto>()
                .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.AppUser.DisplayName))
                .ForMember(d => d.Username, o => o.MapFrom(s => s.AppUser.UserName))
                .ForMember(d => d.Bio, o => o.MapFrom(s => s.AppUser.Bio))
                .ForMember(d => d.Image, o=> o.MapFrom(s => s.AppUser.Photos.FirstOrDefault(x => x.IsMain).Url));

            // Mapping for the user profile image..?
            CreateMap<AppUser, Profiles.Profile>()
                .ForMember(d => d.Image, o=> o.MapFrom(s => s.Photos.FirstOrDefault(x => x.IsMain).Url));
        }
    }
}