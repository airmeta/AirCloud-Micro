using air.cloud.security.common.Model;
using air.cloud.security.common.Utils;
using air.cloud.system.model.Domains.AppInfoDomains;
using air.cloud.system.model.Entitys.Apps;
using air.cloud.system.open.service.Dtos.OpenAccountDtos;
using air.cloud.system.open.service.Services.IOpenAccountServices;

using Air.Cloud.Core;
using Air.Cloud.Core.Extensions;

using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace air.cloud.system.open.service.Impls.OpenAccountServices
{
    [Route("v1/open/account")]
    public class OpenAccountService : IOpenAccountService
    {
        private readonly IHttpContextAccessor _httpContextAccessor; 
        private readonly IAppInfoDomain _appInfoDomain;
        public OpenAccountService(IHttpContextAccessor httpContextAccessor, IAppInfoDomain appInfoDomain) { 
            this._httpContextAccessor = httpContextAccessor;
            this._appInfoDomain = appInfoDomain;
        }

        [HttpPost("detail")]
        public async Task<OpenAccountDetailRDto> GetUserAccountAsync(OpenAccountDetailQDto dto)
        {
            OpenAccountDetailRDto openAccountDetailRDto = new OpenAccountDetailRDto();
            string AppId= _httpContextAccessor.HttpContext.Request.Headers["AppId"].ToString();
            if (string.IsNullOrEmpty(AppId))
            {
                openAccountDetailRDto.Code = 403;
                openAccountDetailRDto.Message = "请求头中缺少AppId";
                return openAccountDetailRDto;
            }
            try
            {
                var app = await _appInfoDomain.GetAppInfoAsync(AppId);
                dto.Ticket = app.Decrypt(dto.Ticket);
                if (dto.Ticket.IsNullOrEmpty())
                {
                    openAccountDetailRDto.Code = 401;
                    openAccountDetailRDto.Message = "无效的Ticket";
                    return openAccountDetailRDto;
                }
            }
            catch (Exception ex)
            {
                AppRealization.Output.Print("账户信息读取", $"账户信息读取失败+{ex.Message}",Air.Cloud.Core.Modules.AppPrint.AppPrintLevel.Warn);
                openAccountDetailRDto.Code = 401;
                openAccountDetailRDto.Message = "无效的Ticket";
                return openAccountDetailRDto;
            }
            try
            {
                UserAccountFactory Account = UserAccountFactoryUtil.GetUserAccount(dto.Ticket);
                openAccountDetailRDto.Account = Account;
                openAccountDetailRDto.Code = 200;
                openAccountDetailRDto.Message = "账户信息读取成功";
            }
            catch (Exception ex)
            {
                AppRealization.Output.Print("账户信息读取",$"账户信息读取失败+{ex.Message}", Air.Cloud.Core.Modules.AppPrint.AppPrintLevel.Warn);
                openAccountDetailRDto.Code = 401;
                openAccountDetailRDto.Message = "账户信息读取失败";
            }
            return openAccountDetailRDto;
        }
    }

}
