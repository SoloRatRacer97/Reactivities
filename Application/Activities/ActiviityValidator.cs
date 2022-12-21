using Domain;
using FluentValidation;

namespace Application.Activities
{
    // This is the class that we made to handle the validation of you data. Each line will take in a rules for the type of data to be checked for
    public class ActiviityValidator : AbstractValidator<Activity>
    {
        public ActiviityValidator()
        {
            RuleFor(x => x.Title).NotEmpty();
            RuleFor(x => x.Description).NotEmpty();
            RuleFor(x => x.Date).NotEmpty();
            RuleFor(x => x.Category).NotEmpty();
            RuleFor(x => x.City).NotEmpty();
            RuleFor(x => x.Venue).NotEmpty();
        }
    }
}