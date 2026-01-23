using air.cloud.security.common.Exceptions;
using air.cloud.security.common.Model;

using Air.Cloud.Core;
using Air.Cloud.Core.Extensions;

namespace air.cloud.security.common.Utils
{
    public static class UserAccountFactoryUtil
    {
        /// <summary>
        /// <para>zh-cn:未登录的票据载荷标识</para>
        /// <para>en-us:Not logged in ticket payload identification</para>
        /// </summary>
        public const string NOT_LOGIN_PAYLOAD = "NOT_LOGIN";
        /// <summary>
        /// <para>zh-cn:根据票据获取用户账户信息</para>
        /// <para>en-us:Get user account information based on ticket</para> 
        /// </summary>
        /// <param name="Ticket">
        ///  <para>zh-cn:票据</para>
        ///  <para>en-us:Ticket</para>
        /// </param>
        /// <returns></returns>
        /// <exception cref="AuthException"></exception>
        public static UserAccountFactory GetUserAccount(string Ticket)
        {
            //1. 检查是不是ForkTicket
            string ForkStoreTicket = AppRealization.RedisCache.String.Get($"Client:ForkId:{Ticket}");
            string LoginTicket = string.Empty;
            if (!ForkStoreTicket.IsNullOrEmpty())
            {
                LoginTicket = ForkStoreTicket;
            }
            else
            {
                LoginTicket = Ticket;
            }
            //2.根据LoginTicket获取信息
            string StoreTicket = AppRealization.RedisCache.String.Get($"Client:Id:{LoginTicket}");
            if (LoginTicket != StoreTicket)
            {
                throw new AuthException("Ticket_Valid_Faild", "Ticket验证不合法");
            }
            string PayLoadInfo = AppRealization.RedisCache.String.Get($"Client:Token:{LoginTicket}");
            if (PayLoadInfo.IsNullOrEmpty())
            {
                throw new AuthException("Ticket_Payload_Faild", "Ticket负载不存在或已过期");
            }
            if (PayLoadInfo == NOT_LOGIN_PAYLOAD)
            {
                return null;
            }
            UserAccountFactory Account = AppRealization.JSON.Deserialize<UserAccountFactory>(PayLoadInfo);
            if (Account.Ticket != LoginTicket)
            {
                throw new AuthException("Ticket_Payload_Faild", "Ticket负载验证不合法");
            }
            if (Account.ExpiredAt < DateTime.Now)
            {
                throw new AuthException("Ticket_Expired", "登录已过期");
            }
            Account.Ticket = LoginTicket;
            return Account;
        }
    }
}
