using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace air.cloud.system.service.Services.PeimissionServices
{
    public interface IPermissionService
    {
        /// <summary>
        /// <para>设置角色权限</para>
        /// </summary>
        /// <param name="roleId"></param>
        /// <param name="permission"></param>
        /// <returns></returns>
        public string SetActionPermission(string roleId, string permission);

        /// <summary>
        /// <para>设置角色菜单权限</para>
        /// </summary>
        /// <param name="roleId"></param>
        /// <param name="menuId"></param>
        /// <returns></returns>
        public bool SetMenuPermission(string roleId, string menuId);

        /// <summary>
        /// <para>检查用户是否有某个权限</para>
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="permission"></param>
        /// <returns></returns>
        public bool CheckActionPermission(string userId, string permission);

        /// <summary>
        /// <para>检查用户是否有某个菜单</para>
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="menuId"></param>
        /// <returns></returns>
        public bool CheckMenuPermission(string userId, string menuId);

        /// <summary>
        /// <para>获取用户权限列表</para>
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="permissions"></param>
        /// <returns></returns>
        public bool GetUserPermissions(string userId, out List<string> permissions);

        /// <summary>
        /// <para>获取用户菜单列表</para>
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="menus"></param>
        /// <returns></returns>
        public bool GetUserMenus(string userId, out List<string> menus);

    }
}
