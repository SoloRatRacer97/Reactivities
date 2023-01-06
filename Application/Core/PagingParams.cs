// This sets up the guidelines for how long the pages can be, specified by the user.

namespace Application.Core
{
    public class PagingParams
    {
        private const int MaxPageSize = 50;
        public int PageNumber { get; set; } = 1;

        private int _pageSize = 2;
        public int PageSize
        {
            // Saying that if the page size requested is larger than the max, 50 in this case, then it will just be set to 50. Otherwise, it will just be set to the value they requested.
            get => _pageSize;
            set => _pageSize = (value > MaxPageSize) ? MaxPageSize : value;
        }
        
    }
}