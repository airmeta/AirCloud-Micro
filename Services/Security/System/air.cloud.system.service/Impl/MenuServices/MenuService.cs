using air.cloud.system.service.Services.MenuServices;
using air.cloud.security.common.Base.Dtos;
using air.cloud.security.common.Model;
using air.cloud.system.model.Domains.MenuDomains;
using air.cloud.system.model.Dtos.MenuDtos;
using air.cloud.system.model.Entitys.Roles;

using Air.Cloud.Core.Extensions;
using Air.Cloud.WebApp.FriendlyException;

using Microsoft.AspNetCore.Mvc;

namespace air.cloud.system.service.Impl.MenuServices
{
    [Route("v1/security/menu")]
    public class MenuService : IMenuService
    {

        private readonly IMenuDomain menuDomain;
        public MenuService(IMenuDomain menuDomain)
        {
             this.menuDomain = menuDomain;
        }

        [HttpPost("save")]
        public async Task<bool> SaveMenuAsync(MenuSDto dto)
        {
            string MenuId=string.Empty;
            if (dto.Id.IsNullOrEmpty())
            {
                MenuId= await menuDomain.CreateMenuAsync(dto);
            }
            else
            {
                MenuId = await menuDomain.UpdateMenuAsync(dto);
            }
            return !MenuId.IsNullOrEmpty();
        }
        [HttpDelete("remove/{menuId}")]
        public async Task<bool> DeleteMenuAsync(string menuId)
        {
            var menu= await menuDomain.GetMenuAsync(menuId);
            if (menu == null) throw Oops.Oh("当前菜单不存在");
            return await menuDomain.DeleteMenuAsync(menu.AppId,menuId);
        }
        [HttpGet("detail/{menuId}")]
        public  async Task<Menu> GetMenuAsync(string menuId)
        {
           return await menuDomain.GetMenuAsync(menuId);
        }
        [HttpPost("query")]
        public async Task<PageList<Menu>> QueryMenusAsync(BaseQDto dto)
        {
           return await menuDomain.QueryMenusAsync(dto);
        }
    }
}
