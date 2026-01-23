using air.cloud.security.common.Model;

namespace air.cloud.system.open.service.Dtos.OpenAccountDtos
{
    /// <summary>
    /// <para>zh-cn:开放账户详情响应DTO</para>
    /// <para>en-us:Open Account Detail Response DTO</para>
    /// </summary>
    public class OpenAccountDetailRDto
    {

        /// <summary>
        /// <para>zh-cn:响应编码  200:成功 401:当前Ticket已过期 403:访问被拒绝</para>
        /// <para>en-us:Response code 200: success 401: the current Ticket has expired 403: access denied</para>
        /// </summary>
        public int Code { get; set; }

        /// <summary>
        /// <para>zh-cn:用户账户信息</para>
        /// <para>en-us:User account information</para>
        /// </summary>
        public UserAccountFactory Account { get; set; }

        /// <summary>
        /// <para>zh-cn:响应消息</para> 
        /// <para>en-us:Response message</para>
        /// </summary>
        public string Message { get; set; }

    }
}
