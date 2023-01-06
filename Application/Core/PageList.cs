// This is the pagination list. This allows us not to return all of the activities to the user when they send a request, and just send back a select few. 

using Microsoft.EntityFrameworkCore;

namespace Application.Core
{
    public class PagedList<T> : List<T>
    {
            public PagedList(IEnumerable<T> items, int count, int pageNumber, int pageSize)
            {
                  CurrentPage = pageNumber;
                  TotalPages = (int)Math.Ceiling(count / (double)pageSize);
                  PageSize = pageSize;
                  TotalCount = count;
                  // This gives us access to the items we are returning? I think?
                  AddRange(items);
            }

        public int CurrentPage { get; set; }
        public int TotalPages { get; set; }
        public int PageSize { get; set; }
        public int TotalCount { get; set; }

        public static async Task<PagedList<T>> CreateAsync(IQueryable<T> source, int pageNumber, int pageSize)
        {
            // This executes a query to our database to count the number of items we have:
            var count = await source.CountAsync();
            // Not understanding the logic here.... 
            var items = await source.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();
            // Then we return the list back:
            return new PagedList<T>(items, count, pageNumber, pageSize);
        }
    }
}