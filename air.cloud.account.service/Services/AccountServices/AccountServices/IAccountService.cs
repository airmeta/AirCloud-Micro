using air.cloud.account.service.Dtos.AccountDtos;

using Air.Cloud.Core.Standard.DynamicServer;

namespace air.cloud.account.service.Services.AccountServices.AccountServices
{
    /// <summary>
    /// <para>zh-cn:账户服务接口</para>
    /// <para>en-us:Account Service Interface</para>
    /// </summary>
    public interface IAccountService:IDynamicService
    {

        /// <summary>
        /// <para>zh-cn:修改密码</para>
        /// <para>en-us:Change Password</para>
        /// </summary>
        /// <param name="dto"></param>
        /// <returns></returns>
        public Task<bool> ChangePasswordAsync(AccountDto dto);


        public Task<string> ResetPasswordAsync(AccountDto dto);
        

    }
}
