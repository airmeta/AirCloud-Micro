using air.cloud.security.common.Base.Dtos;
using air.cloud.security.common.Model;
using air.cloud.system.model.Dtos.AppInfoDtos;
using air.cloud.system.model.Entitys.Apps;

using Air.Cloud.Core.Standard.DynamicServer;

namespace air.cloud.system.service.Services.AppServices
{
    public  interface IAppService: IDynamicService
    {
        /// <summary>
        /// <para>zh-cn:保存App</para>
        /// <para>en-us:Save App</para>   
        /// </summary>
        /// <param name="appName"></param>
        /// <param name="appDescription"></param>
        /// <param name="redirectUri"></param>
        /// <returns></returns>
        public Task<bool> SaveAppAsync(AppInfoCreateDto dto);

        /// <summary>
        ///  <para>zh-cn:创建第一个App</para>
        ///  <para>en-us:Create the first App</para>
        /// </summary>
        /// <param name="dto"></param>
        /// <returns></returns>
        public Task<bool> CreateFirstAppAsync(AppInfoFirstCreateDto dto);


        /// <summary>
        /// <para>zh-cn:删除App</para>
        /// <para>en-us:Delete App</para>
        /// </summary>
        /// <param name="appId"></param>
        public Task<bool> DeleteAppAsync(string appId);

        /// <summary>
        /// <para>zh-cn:获取App信息</para>
        /// <para>en-us:Get App Info</para>
        /// </summary>
        /// <param name="appId"></param>
        /// <returns></returns>
        public Task<AppInfoResultDto> GetAppInfoAsync(string appId);

        /// <summary>
        /// <para>zh-cn:列出所有App</para>
        /// <para>en-us:List All Apps</para>
        /// </summary>
        /// <returns></returns>
        public Task<List<AppSelectRDto>> ListAllAppsAsync();

        /// <summary>
        /// <para>zh-cn:查询App</para>
        /// <para>en-us:Query App</para>
        /// </summary>
        /// <returns></returns>
        public Task<PageList<AppInfoResultDto>> QueryAppsAsync(BaseQDto dto);


        #region 角色与App关联
        /// <summary>
        /// 分配应用给角色
        /// </summary>
        /// <param name="roleId"></param>
        /// <param name="appId"></param>
        /// <returns></returns>
        public Task<bool> JoinAppToRoleAsync(string roleId, string appId);
        /// <summary>
        /// 移除角色的应用
        /// </summary>
        /// <param name="roleId"></param>
        /// <param name="appId"></param>
        /// <returns></returns>
        public Task<bool> RemoveAppFromRoleAsync(string roleId, string appId);



        #endregion
    }
}
