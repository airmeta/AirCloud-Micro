using air.cloud.security.common.Base.Dtos;
using air.cloud.security.common.Model;
using air.cloud.system.model.Dtos.MenuDtos;
using air.cloud.system.model.Entitys.Roles;

using Air.Cloud.Core.Standard.DynamicServer;

namespace air.cloud.system.service.Services.MenuServices
{
    public interface IMenuService:IDynamicService
    {
        /// <summary>
        /// 创建菜单
        /// </summary>
        /// <param name="dto"></param>
        /// <returns></returns>
        public Task<bool> SaveMenuAsync(MenuSDto dto);
        /// <summary>
        /// 删除菜单(删除所有有关于该菜单的权限)
        /// </summary>
        /// <param name="AppId"></param>
        /// <param name="menuId"></param>
        /// <returns></returns>
        public Task<bool> DeleteMenuAsync(string menuId);
        /// <summary>
        /// 查询菜单
        /// </summary>
        /// <param name="dto"></param>
        /// <returns></returns>
        public Task<PageList<Menu>> QueryMenusAsync(BaseQDto dto);

        /// <summary>
        /// 查询单个菜单
        /// </summary>
        /// <param name="menuId"></param>
        /// <returns></returns>
        public Task<Menu> GetMenuAsync(string menuId);

    }
}
