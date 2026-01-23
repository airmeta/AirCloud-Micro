using air.cloud.system.model.Dtos.AccountDtos;

using Air.Cloud.Core.Standard.DynamicServer;
using air.cloud.account.service.Dtos.LoginDtos;

namespace air.cloud.account.service.Services.AccountServices.AccountLoginServices
{
    /// <summary>
    /// <para>zh-cn:账户登录服务</para>
    /// <para>en-us:Account Login Service</para>
    /// </summary>
    public interface IAccountLoginService: IDynamicService
    {
        /// <summary>
        /// <para>zh-cn:账户登录</para>
        /// <para>en-us:Account Login</para>
        /// </summary>
        /// <param name="Payload"></param>
        /// <returns></returns>
        Task<AccountLoginRDto> Login(LoginDto Payload);
        /// <summary>
        /// <para>zh-cn:账户登出</para>
        /// <para>en-us:Account Logout</para>
        /// </summary>
        /// <param name="Ticket"></param>
        /// <returns></returns>
        Task<AccountLoginOutRDto> LoginOutAsync();
        /// <summary>
        /// <para>zh-cn:查询账户可用的应用列表</para>
        /// <para>en-us:Query the list of applications available to the account</para>
        /// </summary>
        /// <returns></returns>
        Task<IList<AccountAppIdsRDto>> QueryAccountAppAsync();

    }
}
