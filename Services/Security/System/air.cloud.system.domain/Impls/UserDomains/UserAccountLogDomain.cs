using air.cloud.security.common.Base.Dtos;
using air.cloud.security.common.Extensions;
using air.cloud.security.common.Model;
using air.cloud.system.model.Domains.UserDomains;
using air.cloud.system.model.Dtos.UserAccountLogDtos;
using air.cloud.system.model.Entitys.Users;

using Air.Cloud.Core.Extensions;
using Air.Cloud.Core.Extensions.Linqs;
using Air.Cloud.DataBase.Repositories;

using Microsoft.EntityFrameworkCore;

namespace air.cloud.system.domain.Impls.UserDomains
{
    /// <summary>
    /// <para>zh-cn:用户账户日志领域实现</para>
    /// <para>en-us:User account log domain implementation</para>
    /// </summary>
    public class UserAccountLogDomain : IUserAccountLogDomain
    {
        private readonly IRepository<UserAccountLog> _repository;

        public UserAccountLogDomain(IRepository<UserAccountLog> repository)
        {
            _repository = repository;
        }

        /// <summary>
        /// <para>zh-cn:创建用户账户日志</para>
        /// <para>en-us:Create user account log</para>
        /// </summary>
        public async Task<string> CreateUserAccountLogAsync(UserAccountLogSDto log)
        {
            if (log == null) return string.Empty;
            log.Validate();

            var entity = new UserAccountLog
            {
                Id = string.IsNullOrWhiteSpace(log.Id) ? Guid.NewGuid().ToString("N") : log.Id!,
                UserId = log.UserId,
                TypeCode = log.TypeCode,
                Meta = log.Meta,
                Remark = log.Remark
            };
            await _repository.InsertAsync(entity);
            return entity.Id;
        }

        /// <summary>
        /// <para>zh-cn:分页查询用户账户日志</para>
        /// <para>en-us:Query user account logs with paging</para>
        /// </summary>
        public async Task<PageList<UserAccountLogRDto>> QueryUserAccountLogsAsync(UserAccountLogQDto dto)
        {
            var linq = LinqExpressionExtensions.And<UserAccountLog>();
            if (!dto.Info.IsNullOrEmpty())
            {
                linq = linq.And(s =>
                    s.TypeCode.Contains(dto.Info) ||
                    s.Remark.Contains(dto.Info));
            }
            if (!dto.UserId.IsNullOrEmpty())
            {
                linq = linq.And(s => s.UserId == dto.UserId);
            }
            else
            {
                return new PageList<UserAccountLogRDto>
                {
                    List = new List<UserAccountLogRDto>(),
                    Count = 0
                };
            }
            var query = _repository.Entities.Where(linq)
                .OrderByDescending(s => s.Id)
                .Select(s => new UserAccountLogRDto
                {
                    Id = s.Id,
                    UserId = s.UserId,
                    TypeCode = s.TypeCode,
                    Meta = s.Meta,
                    Remark = s.Remark,
                    CreateTime = s.CreateTime
                })
                .AsQueryable();

            return await query.ToPageListAsync<UserAccountLogRDto>(dto.Page, dto.Limit);
        }

        /// <summary>
        /// <para>zh-cn:获取用户账户日志详情</para>
        /// <para>en-us:Get user account log detail</para>
        /// </summary>
        public async Task<UserAccountLogRDto?> GetUserAccountLogAsync(string id)
        {
            if (id.IsNullOrEmpty()) return null;
            var s = await _repository.DetachedEntities.FirstOrDefaultAsync(x => x.Id == id);
            if (s == null) return null;

            return new UserAccountLogRDto
            {
                Id = s.Id,
                UserId = s.UserId,
                TypeCode = s.TypeCode,
                Meta = s.Meta,
                Remark = s.Remark
            };
        }
    }
}