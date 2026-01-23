using air.security.common.Dtos.RequestValidDtos;

using Air.Cloud.Core.Standard.DynamicServer;

namespace air.cloud.auth.service.Services.AuthValidServices
{
    public interface IAuthValidService: IDynamicService,ITransient
    {
        /// <summary>
        /// <para>zh-cn:验证票据信息</para>
        /// </summary>
        /// <param name="Ticket"></param>
        /// <returns></returns>
        public Task<RequestValidResult> ValidTicket(string Ticket, string ClientId);

    }
}
