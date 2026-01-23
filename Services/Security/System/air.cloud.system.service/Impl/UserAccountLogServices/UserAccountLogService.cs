using air.cloud.system.service.Services.UserAccountLogServices;
using air.cloud.security.common.Base.Dtos;
using air.cloud.security.common.Model;
using air.cloud.system.model.Domains.UserDomains;
using air.cloud.system.model.Dtos.UserAccountLogDtos;

using Air.Cloud.Core.Extensions;
using Air.Cloud.WebApp.FriendlyException;

using Microsoft.AspNetCore.Mvc;

using System.ComponentModel;

namespace air.cloud.system.service.Impl.UserAccountLogServices
{
    /// <summary>
    /// <para>zh-cn:用户账户日志服务</para>
    /// <para>en-us:User account log service</para>
    /// </summary>
    [Route("v1/security/account/log")]
    [Description("用户账户日志管理")]
    public class UserAccountLogService : IUserAccountLogService
    {
        private readonly IUserAccountLogDomain _domain;

        public UserAccountLogService(IUserAccountLogDomain domain)
        {
            _domain = domain;
        }

        /// <summary>
        /// <para>zh-cn:创建用户账户日志</para>
        /// <para>en-us:Create user account log</para>
        /// </summary>
        [HttpPost("save")]
        public async Task<bool> SaveUserAccountLogAsync(UserAccountLogSDto dto)
        {
            if (dto == null) throw Oops.Oh("参数不能为空");
            dto.Validate();

            var id = await _domain.CreateUserAccountLogAsync(dto);
            return !id.IsNullOrEmpty();
        }

        /// <summary>
        /// <para>zh-cn:分页查询用户账户日志</para>
        /// <para>en-us:Query user account logs with paging</para>
        /// </summary>
        [HttpPost("query")]
        public async Task<PageList<UserAccountLogRDto>> QueryUserAccountLogsAsync(UserAccountLogQDto dto)
        {
            return await _domain.QueryUserAccountLogsAsync(dto);
        }

        /// <summary>
        /// <para>zh-cn:获取用户账户日志详情</para>
        /// <para>en-us:Get user account log detail</para>
        /// </summary>
        [HttpGet("detail/{id}")]
        public async Task<UserAccountLogRDto?> GetUserAccountLogAsync(string id)
        {
            if (id.IsNullOrEmpty()) return null;
            return await _domain.GetUserAccountLogAsync(id);
        }
    }
}