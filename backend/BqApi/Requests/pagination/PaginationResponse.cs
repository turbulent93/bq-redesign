namespace BeautyQueenApi.Requests.Pagination
{
    public class PaginationResponse<T> {
        public int TotalPages { get; set; }
        public int TotalCount { get; set; }
        public List<T> List { get; set; }

        public PaginationResponse(List<T> list, int? page, int? pageSize)
        {
            if(page == null || pageSize == null)
            {
                TotalCount = list.Count;
                TotalPages = 1;
                List = list;
                return;
            }

            TotalCount = list.Count;
            TotalPages = (int)Math.Ceiling(TotalCount / (double)pageSize);
            var smoothedPage = Math.Min(Math.Max(1, (int)page), TotalPages);
            List = list.Skip((int)((smoothedPage - 1) * pageSize)).Take((int)pageSize).ToList();
        }
    }
}