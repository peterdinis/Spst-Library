using FluentValidation;
using PublisherService.Entities;

namespace PublisherService.Validators
{
    public class PublisherValidator : AbstractValidator<Publisher>
    {
        public PublisherValidator()
        {
            RuleFor(p => p.Name)
                .NotEmpty().WithMessage("Publisher name is required.")
                .MaximumLength(150).WithMessage("Publisher name cannot exceed 150 characters.");

            RuleFor(p => p.Address)
                .MaximumLength(250).WithMessage("Address cannot exceed 250 characters.");

            RuleFor(p => p.ContactNumber)
                .MaximumLength(50).WithMessage("Contact number cannot exceed 50 characters.")
                .Matches(@"^\+?[0-9\s\-]*$").WithMessage("Contact number is not valid.");
        }
    }
}
