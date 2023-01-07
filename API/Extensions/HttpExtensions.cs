// Extension class for adding the pagination header to our requests so we can filter the results of the activities:

using System.Text.Json;

namespace API.Extensions
{
    public static class HttpExtensions
    {
        public static void AddPaginationHeader(this HttpResponse response, int currentPage, int itemsPerPage, int totalItems, int totalPages)
        {
            var paginationHeader = new 
            {
                currentPage,
                itemsPerPage,
                totalItems,
                totalPages
            };
            response.Headers.Add("Pagination", JsonSerializer.Serialize(paginationHeader));
            // Recall that when we are dealing with headers and urls we need to be EXACT in our spelling. Always double check these and ensure they are correct.
            response.Headers.Add("Access-Control-Expose-Headers", "Pagination");
        }
    }
}