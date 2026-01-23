using air.cloud.security.common.Model;

using Air.Cloud.Core.Standard.DynamicServer;

namespace air.cloud.auth.service.Services.AuthStoreServices
{
    /// <summary>
    /// <para>zh-cn:认证存储服务</para>
    /// <para>en-us:Authentication Storage Service</para>
    /// </summary>
    public interface IAuthStoreService:IDynamicService,ITransient
    {
        /// <summary>
        /// <para>zh-cn:创建临时票据</para>
        /// <para>en-us:Create a temporary ticket</para>
        /// </summary>
        /// <returns></returns>
        Task<TicketCreateResult> CreateTempTicketAsync();
        /// <summary>
        /// <para>zh-cn:通过指定票据创建衍生票据</para>
        /// <para>en-us:Create derived tickets through specified tickets</para>
        /// </summary>
        /// <param name="Ticket"></param>
        /// <returns></returns>
        Task<TicketCreateResult> ForkAppTicketByTicket(string Ticket);
        /// <summary>
        /// <para>zh-cn:获取指定票据的载荷信息</para>
        /// <para>en-us:Get the payload information of the specified ticket</para>
        /// </summary>
        /// <param name="Ticket"></param>
        /// <returns></returns>
        Task<UserAccountFactory> GetAccountPayloadInfoAsync(string Ticket);

        /// <summary>
        /// <para>zh-cn:创建票据</para>
        /// <para>en-us:Create Ticket</para>
        /// </summary>
        /// <param name="userAccountFactory"></param>
        /// <returns></returns>
        Task<TicketCreateResult> TicketCreateAsync(UserAccountFactory userAccountFactory);

    }
}
