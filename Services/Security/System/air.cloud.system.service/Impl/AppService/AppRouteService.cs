using air.cloud.system.service.Services.AppServices;
using air.cloud.security.common.Base.Dtos;
using air.cloud.security.common.Dtos;
using air.cloud.security.common.Model;
using air.cloud.system.model.Domains.AppInfoDomains;
using air.cloud.system.model.Dtos.AppInfoDtos;
using air.cloud.system.model.Entitys.Apps;

using Air.Cloud.Core.Extensions;

using Microsoft.AspNetCore.Mvc;

namespace air.cloud.system.service.Impl.AppService
{
    [Route("v1/security/approute")]
    public class AppRouteService : IAppRouteService
    {
        private readonly IAppRouteDomain appRouteDomain;
        public AppRouteService(IAppRouteDomain appRouteDomain) { 
        
            this.appRouteDomain= appRouteDomain;    
        }

        /// <summary>
        /// <para>zh-cn:保存App路由</para>
        /// <para>en-us:Save AppRoute</para>   
        /// </summary>
        /// <returns></returns>
        [HttpPost("save")]
        public async Task<bool> SaveAppRouteAsync(AppRouteSDto dto)
        {
            if (dto.Id.IsNullOrEmpty())
            {
                return await appRouteDomain.CreateAppRouteAsync(dto);
            }
            return await appRouteDomain.UpdateAppRouteAsync(dto);
        }


        /// <summary>
        /// <para>zh-cn:删除App路由</para>
        /// <para>en-us:Delete AppRoute</para>
        /// </summary>
        /// <param name="appId"></param>
        [HttpDelete("remove/{Id}")]
        public async Task<bool> DeleteAppRouteAsync(string Id)
        {
            return await appRouteDomain.DeleteAppRouteAsync(Id);
        }


        /// <summary>
        /// <para>zh-cn:获取App路由信息</para>
        /// <para>en-us:Get AppRoute Info</para>
        /// </summary>
        /// <param name="appId"></param>
        /// <returns></returns>
        [HttpGet("detail/{Id}")]
        public async Task<AppRoute> GetAppRouteAsync(string Id)
        {
            return await appRouteDomain.GetAppRouteAsync(Id);
        }


        /// <summary>
        /// <para>zh-cn:查询应用所有路由授权信息</para>
        /// <para>en-us:Query All AppRoute Auth Info</para>
        /// </summary>
        /// <param name="BindAppId"></param>
        /// <returns></returns>
        [HttpGet("query/all-auth/{BindAppId}")]
        public async Task<IList<AppRouteCacheDto>> QueryAllAppRouteAuthAsync(string BindAppId)
        {
            return await appRouteDomain.QueryAllAppRouteAuthAsync(BindAppId);
        }


        #region 查询应用路由列表或下拉框

        /// <summary>
        /// <para>zh-cn:查询App路由列表</para>
        /// <para>en-us:Query AppRoute List</para>
        /// </summary>
        /// <param name="dto"></param>
        /// <returns></returns>
        [HttpPost("query/route")]
        public async Task<PageList<AppRoute>> QueryAppRoutesAsync(BaseQDto dto)
        {
            return await appRouteDomain.QueryAppRoutesAsync(dto); 
        }

        #endregion



        #region  应用路由授权管理
        /// <summary>
        /// <para>zh-cn:查询应用路由授权信息</para>
        /// <para>en-us:Query AppRoute Auth Info</para>
        /// </summary>
        /// <param name="dto"></param>
        /// <returns></returns>
        [HttpPost("query/auth")]
        public async Task<PageList<AppRouteCacheDto>> QueryAppRouteAuthAsync(BaseQDto dto)
        {
            return await appRouteDomain.QueryAppRouteAuthAsync(dto);
        }


        /// <summary>
        /// <para>zh-cn:绑定应用路由到具体应用</para>
        /// <para>en-us:Bind AppRoute to specific App</para>
        /// </summary>
        /// <param name="RouteId">
        ///  <para>zh-cn:路由信息编号</para>
        ///  <para>en-us:Route Info Id</para>
        /// </param>
        /// <param name="BindAppId">
        ///  <para>zh-cn:绑定的应用编号</para>
        ///  <para>en-us:Bind App Id</para>
        /// </param>
        /// <returns>
        ///  <para>zh-cn:绑定结果</para>
        ///  <para>en-us:Bind Result</para>
        /// </returns>
        [HttpGet("bind/{RouteId}/{BindAppId}")]
        public async Task<bool> BindAppRouteAsync(string RouteId, string BindAppId)
        {
            return await appRouteDomain.BindAppRouteAsync(RouteId, BindAppId);
        }


        /// <summary>
        /// <para>zh-cn:解绑应用路由到具体应用</para>
        /// <para>en-us:Remove AppRoute from specific App</para>
        /// </summary>
        /// <param name="RouteId">
        ///  <para>zh-cn:路由信息编号</para>
        ///  <para>en-us:Route Info Id</para>
        /// </param>
        /// <param name="BindAppId">
        ///  <para>zh-cn:绑定的应用编号</para>
        ///  <para>en-us:Bind App Id</para>
        /// </param>
        /// <returns>
        ///  <para>zh-cn:解绑结果</para>
        ///  <para>en-us:Remove Result</para>
        /// </returns>
        [HttpGet("remove/{RouteId}/{BindAppId}")]
        public async Task<bool> RemoveAppRouteAuthAsync(string RouteId, string BindAppId)
        {
            return await appRouteDomain.RemoveAppRouteAuthAsync(RouteId, BindAppId);
        }


        #endregion

    }
}
