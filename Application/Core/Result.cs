namespace Application.Core
// This class will be used to create objects for each one of our responses. So, we will assign it a generic type of <T>.
// This objec tis what we will be returning as our response. We are setting it up with a bit more data to allow us to validate whether or not it was a good request and if it had erorrs. 
{
    // T will usually be an activity.
    public class Result<T>
    {
        public bool IsSuccess { get; set; }
        public T Value { get; set; }
        public string Error { get; set; }

        // This method will either return the activity value or it will return null if nothing is found.
        public static Result<T> Success(T value) => new Result<T> {IsSuccess = true, Value = value};
        public static Result<T> Failure(string error) => new Result<T> {IsSuccess = false, Error = error};
    }
}