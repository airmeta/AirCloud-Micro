using air.cloud.auth.service.Services.AuthStoreServices;
using air.cloud.security.common.Auths;
using air.cloud.security.common.Model;
using air.cloud.security.common.Utils;

using Air.Cloud.Core;
using Air.Cloud.Core.App;
using Air.Cloud.Core.Extensions;
using Air.Cloud.Core.Standard.DistributedLock.Attributes;
using Air.Cloud.Core.Standard.Taxin.Attributes;

using Microsoft.AspNetCore.Mvc;

namespace air.cloud.auth.service.Impls.AuthStoreServices
{
    [Route("v1/auth/store")]
    public class AuthStoreService : IAuthStoreService
    {
        /// <summary>
        /// <para>zh-cn:未登录的票据载荷标识</para>
        /// <para>en-us:Not logged in ticket payload identification</para>
        /// </summary>
        public const string NOT_LOGIN_PAYLOAD = "NOT_LOGIN";

        private readonly IUserAccountStore userAccount;

        public AuthStoreService(IUserAccountStore userAccount)
        {
            this.userAccount = userAccount;
        }

        [HttpGet("Ticket/temp")]
        [TaxinService("skymirrorshield_create_temp_Ticket")]
        public async Task<TicketCreateResult> CreateTempTicketAsync()
        {
            int StoreSeconds = 30*60*60;
            string Ticket = AppCore.Guid();
            await AppRealization.RedisCache.String.SetAsync($"Client:Id:{Ticket}", Ticket, new TimeSpan(0, 0, StoreSeconds));
            await AppRealization.RedisCache.String.SetAsync($"Client:Token:{Ticket}", NOT_LOGIN_PAYLOAD, new TimeSpan(0, 0, StoreSeconds));
            return new TicketCreateResult
            {
                Ticket = Ticket,
                ExpiredAt = DateTime.Now.AddSeconds(StoreSeconds),
                Payload = null
            };
        }

        [HttpPost("Ticket/create")]
        [TaxinService("skymirrorshield_create_Ticket")]
        public async Task<TicketCreateResult> TicketCreateAsync(UserAccountFactory userAccountFactory)
        {
            int StoreSeconds = 30 * 60 * 60;
            string Ticket = userAccountFactory.Ticket;
            if (Ticket.IsNullOrEmpty())
            {
                Ticket = AppCore.Guid();
                userAccountFactory.Ticket = Ticket;
            }
            userAccountFactory.ExpiredAt = DateTime.Now.AddSeconds(StoreSeconds);
            string Payload = AppRealization.JSON.Serialize(userAccountFactory);
            await AppRealization.RedisCache.String.SetAsync($"Client:Id:{Ticket}", Ticket, new TimeSpan(0, 0, StoreSeconds));
            await AppRealization.RedisCache.String.SetAsync($"Client:Token:{Ticket}", Payload, new TimeSpan(0, 0, StoreSeconds));
            return new TicketCreateResult
            {
                Ticket = Ticket,
                ExpiredAt = DateTime.Now.AddSeconds(StoreSeconds),
                Payload = userAccountFactory.GetAccountPublicPayLoad()
            };
        }

        [HttpGet("Ticket/payload/{Ticket}")]
        [TaxinService("skymirrorshield_get_account_payload")]
        public async Task<UserAccountFactory> GetAccountPayloadInfoAsync(string Ticket)
        {
            return UserAccountFactoryUtil.GetUserAccount(Ticket);
        }

        [HttpGet("Ticket/fork/{Ticket}")]
        [TaxinService("skymirrorshield_fork_Ticket")]
        [DistributedLock]
        public async Task<TicketCreateResult> ForkAppTicketByTicket(string Ticket)
        {
            UserAccountFactory userAccountFactory = await userAccount.GetUserAccountAsync(Ticket);
            if (userAccountFactory == null)
            {
                return new TicketCreateResult
                {
                    Code = 401,
                    Message = "身份认证无效或已过期"
                };
            }
            string AppTicket = AppCore.Guid();
            AppRealization.Lock.TryExecuteWithLock(Ticket, () =>
            {
                var AppIdExpiredAt = userAccountFactory.ExpiredAt - DateTime.Now;

                int Seconds = (int)(AppIdExpiredAt.TotalMilliseconds / 1000);

                AppRealization.RedisCache.String.Set($"Client:ForkId:{AppTicket}", Ticket, new TimeSpan(0, 0, Seconds));

                string ForkIds=AppRealization.RedisCache.String.Get($"Client:ForkIds:{Ticket}");

                if (ForkIds.IsNullOrEmpty())
                {
                    ForkIds = AppTicket;
                }
                else
                {
                    ForkIds = $"{ForkIds},{AppTicket}";
                }
                AppRealization.RedisCache.String.Set($"Client:ForkIds:{Ticket}", ForkIds, new TimeSpan(0, 0, Seconds)); 
            },new TimeSpan(0,0,10));

            return new TicketCreateResult
            {
                Ticket = AppTicket,
                ExpiredAt = userAccountFactory.ExpiredAt,
                Payload = userAccountFactory.GetAccountPublicPayLoad()
            };
        }

        [HttpGet("Ticket/clear/{Ticket}")]
        [TaxinService("skymirrorshield_clear_Ticket")]
        public async Task<TicketCreateResult> ClearAppTicketByTicket(string Ticket)
        {
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
            //1. 删除ForkId
            string ForkIds = AppRealization.RedisCache.String.Get($"Client:ForkIds:{LoginTicket}");

            string[] ForkIdsArray = ForkIds.Split(',', StringSplitOptions.RemoveEmptyEntries);

            foreach (var item in ForkIdsArray)
            {
                AppRealization.RedisCache.Key.Delete($"Client:ForkId:{item}");
            }
            AppRealization.RedisCache.Key.Delete($"Client:ForkIds:{LoginTicket}");
            AppRealization.RedisCache.Key.Delete($"Client:Id:{Ticket}");
            AppRealization.RedisCache.Key.Delete($"Client:Token:{Ticket}");

            return new TicketCreateResult
            {
                Code = 200,
                Message = "Ticket清理成功"
            };
        }
    }
}
