using air.cloud.system.model.Dtos.AccountDtos;

using Air.Cloud.Core.Standard.DynamicServer;

namespace air.cloud.account.service.Services.AccountServices.AppLoginServices
{
    /// <summary>
    /// <para>zh-cn:应用登录服务</para>
    /// <para>en-us:App Login Service</para>
    /// </summary>
    public interface IAppLoginService: IDynamicService
    {
        /// <summary>
        /// <para>zh-cn:登录完成,获取账户信息</para>
        /// <para>en-us:After login, get account information</para>
        /// </summary>
        /// <returns></returns>
        Task<UserAccountInfo> GetAuthority(string RandomKey);

        /// <summary>
        /// <para>zh-cn:获取重定向地址</para>
        /// <para>en-us:Get redirect URL</para>
        /// </summary>
        /// <returns>
        /// 
        /// </returns>
        Task<string> GetRedirectUrl(string AppId);

    }
}
