using air.cloud.system.model.Dtos.PermissionDtos;
using air.cloud.system.model.Entitys.Roles;
using air.cloud.security.common.Base.Dtos;

using Air.Cloud.Core.Standard.DataBase.Domains;
using Air.Cloud.Core.Standard.DynamicServer;

namespace air.cloud.system.model.Domains.ActionPermissionDomains
{
    /// <summary>
    /// 权限领域
    /// </summary>
    public interface IActionPermissionDomain : IEntityDomain, ITransient
    {
        /// <summary>
        /// 创建权限
        /// </summary>
        /// <returns></returns>
        public Task<bool> CreateActionPermissionAsync(ActionPermissionSDto dto);
        /// <summary>
        /// 删除权限
        /// </summary>
        /// <param name="permissionId"></param>
        /// <returns></returns>
        public Task<bool> DeleteActionPermission(string permissionId);
        /// <summary>
        /// 更新权限信息
        /// </summary>
        /// <param name="permissionId"></param>
        /// <param name="permissionName"></param>
        /// <param name="permissionCode"></param>
        /// <param name="description"></param>
        /// <returns></returns>
        public Task<bool> UpdateActionPermission(ActionPermissionSDto dto);

        /// <summary>
        /// 查询权限信息
        /// </summary>
        /// <param name="Info"></param>
        /// <returns></returns>
        public Task<(int, List<ActionPermission>)> QueryActionPermissions(BaseQDto dto);

        /// <summary>
        /// 获取权限信息
        /// </summary>
        /// <param name="permissionId"></param>
        /// <returns></returns>
        public Task<ActionPermission> GetActionPermissionAsync(string permissionId);



        /// <summary>
        /// 同步应用中的动作信息到权限表
        /// </summary>
        /// <returns></returns>
        public Task<ActionToPermissionRDto> StoreActionsToPermissionAsync(string AppId);


    }
}
