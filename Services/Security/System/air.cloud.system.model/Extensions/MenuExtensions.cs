using air.cloud.system.model.Dtos.AccountDtos;
using air.cloud.system.model.Entitys.Roles;

using Air.Cloud.Core.Extensions;

namespace air.cloud.system.model.Extensions
{
    public static class MenuExtensions
    {
        public static IList<AuthorityItem> GetAuthorities(this IList<Menu> menus, string MenuId = null)
        {
            IList<AuthorityItem> items = new List<AuthorityItem>();
            if (MenuId.IsNullOrEmpty())
            {
                List<Menu> ChildrenMenus = menus.Where(s => s.ParentId.IsNullOrEmpty()).ToList();
                foreach (var item in ChildrenMenus)
                {
                    items.Add(new AuthorityItem()
                    {
                        SortNumber = item.SortNumber,
                        Children = GetAuthorities(menus, item.Id),
                        Component = item.Component,
                        Icon = item.Icon,
                        Path = item.Path,
                        Title = item.Title,
                        Type = item.Type,
                        Id=item.Id,
                        Hide=item.Hide,
                        Authority=item.Authority,
                        Meta=string.Empty
                    });
                }
                return items;
            }
            else
            {
                List<Menu> ChildrenMenus = menus.Where(s => s.ParentId == MenuId).ToList();
                foreach (var item in ChildrenMenus)
                {
                    items.Add(new AuthorityItem()
                    {
                        SortNumber = item.SortNumber,
                        Children = GetAuthorities(menus, item.Id),
                        Component = item.Component,
                        Icon = item.Icon,
                        Path = item.Path,
                        Title = item.Title,
                        Type = item.Type,
                        Id = item.Id,
                        Hide = item.Hide,
                        Authority = item.Authority,
                        Meta = string.Empty
                    });
                }
                return items;
            }
        }

    }
}
