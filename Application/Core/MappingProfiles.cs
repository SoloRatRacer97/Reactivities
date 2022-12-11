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
        }
    }
}