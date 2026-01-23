using air.cloud.security.common.Model;

using Microsoft.EntityFrameworkCore;

namespace air.cloud.security.common.Extensions
{
    public static  class TableQueryExtensions
    {
        public static async Task<PageList<T>> ToPageListAsync<T>(this IQueryable<T> source, int page, int limit)
            where T : class
        {
            var count=await source.CountAsync();
            if (page==0||limit==0)
            {
                var items = await source.ToListAsync();
                return new PageList<T>()
                {
                    Count = count,
                    List = items
                };
            }
            else
            {
                var items = await source.Skip((page - 1) * limit).Take(limit).ToListAsync();
                return new PageList<T>()
                {
                    Count = count,
                    List = items
                };
                
            }
        }

    }
}
