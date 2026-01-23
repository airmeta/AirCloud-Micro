using air.cloud.auth.service.Services.AuthValidServices;
using air.security.common.Dtos.RequestValidDtos;

using Air.Cloud.Core;
using Air.Cloud.Core.Extensions;
using Air.Cloud.Core.Standard.Taxin.Attributes;

using Microsoft.AspNetCore.Mvc;

namespace air.cloud.auth.service.Impls.AuthValidServices
{
    [Route("v1/auth/valid")]
    public  class AuthValidService : IAuthValidService
    {
        [HttpGet("Ticket/{Ticket}/{ClientId}")]
        [TaxinService("skymirrorshield_valid_Ticket")]
        public async Task<RequestValidResult> ValidTicket(string Ticket,string ClientId)
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
            string StoreTicket = AppRealization.RedisCache.String.Get($"Client:Id:{LoginTicket}");
            if (LoginTicket != StoreTicket)
            {
                return new RequestValidResult()
                {
                    Valid= false
                };
            }
            return new RequestValidResult()
            {
                Valid = true
            };
        }

    }
}
