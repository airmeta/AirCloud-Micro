using air.cloud.system.model.Dtos.MenuDtos;
using air.cloud.system.model.Entitys.Roles;
using air.cloud.security.common.Base.Dtos;
using air.cloud.security.common.Model;

using Air.Cloud.Core.Standard.DataBase.Domains;
using Air.Cloud.Core.Standard.DynamicServer;

namespace air.cloud.system.model.Domains.MenuDomains
{
    public interface IMenuDomain : IEntityDomain, ITransient
    {
        /// <summary>
        /// 创建菜单
        /// </summary>
        /// <param name="dto"></param>
        /// <returns></returns>
        public Task<string> CreateMenuAsync(MenuSDto dto);
        /// <summary>
        /// 删除菜单(删除所有有关于该菜单的权限)
        /// </summary>
        /// <param name="AppId"></param>
        /// <param name="menuId"></param>
        /// <returns></returns>
        public Task<bool> DeleteMenuAsync(string AppId, string menuId);
        /// <summary>
        /// 更新菜单
        /// </summary>
        /// <param name="dto"></param>
        /// <returns></returns>
        public Task<string> UpdateMenuAsync(MenuSDto dto);
        /// <summary>
        /// 查询菜单
        /// </summary>
        /// <param name="dto"></param>
        /// <returns></returns>
        public Task<PageList<Menu>> QueryMenusAsync(BaseQDto dto);

        /// <summary>
        /// 查询单个菜单
        /// </summary>
        /// <param name="authorityId"></param>
        /// <returns></returns>
        public Task<Menu> GetMenuAsync(string authorityId);
        /// <summary>
        /// 查询角色关联的菜单
        /// </summary>
        /// <param name="RoleIds"></param>
        /// <param name="AppId"></param>
        /// <returns></returns>
        Task<List<Menu>> GetMenusByRoleIdsAsync(List<string> RoleIds, string AppId);
    }
}
