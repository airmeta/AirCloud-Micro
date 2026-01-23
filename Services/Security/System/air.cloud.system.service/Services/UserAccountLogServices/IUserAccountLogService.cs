using air.cloud.security.common.Base.Dtos;
using air.cloud.security.common.Model;
using air.cloud.system.model.Dtos.UserAccountLogDtos;

using Air.Cloud.Core.Standard.DynamicServer;

namespace air.cloud.system.service.Services.UserAccountLogServices
{
    /// <summary>
    /// <para>zh-cn:用户账户日志服务接口</para>
    /// <para>en-us:User account log service interface</para>
    /// </summary>
    public interface IUserAccountLogService : IDynamicService
    {
        /// <summary>
        /// <para>zh-cn:创建用户账户日志</para>
        /// <para>en-us:Create user account log</para>
        /// </summary>
        /// <param name="dto">
        ///  <para>zh-cn:用户账户日志保存传输对象</para>
        ///  <para>en-us:User account log save DTO</para>
        /// </param>
        /// <returns>
        ///  <para>zh-cn:返回保存结果，true表示成功，false表示失败</para>
        ///  <para>en-us:Returns the save result, true indicates success, false indicates failure</para>
        /// </returns>
        Task<bool> SaveUserAccountLogAsync(UserAccountLogSDto dto);

        /// <summary>
        /// <para>zh-cn:分页查询用户账户日志</para>
        /// <para>en-us:Query user account logs with paging</para>
        /// </summary>
        /// <param name="dto">
        ///  <para>zh-cn:基础查询参数</para>
        ///  <para>en-us:Basic query parameters</para>
        /// </param>
        /// <returns>
        ///  <para>zh-cn:分页的日志返回对象列表</para>
        ///  <para>en-us:Paged list of log response DTOs</para>
        /// </returns>
        Task<PageList<UserAccountLogRDto>> QueryUserAccountLogsAsync(UserAccountLogQDto dto);

        /// <summary>
        /// <para>zh-cn:获取用户账户日志详情</para>
        /// <para>en-us:Get user account log detail</para>
        /// </summary>
        /// <param name="id">
        ///  <para>zh-cn:日志ID</para>
        ///  <para>en-us:Log Id</para>
        /// </param>
        /// <returns>
        ///  <para>zh-cn:用户账户日志返回传输对象</para>
        ///  <para>en-us:User account log response DTO</para>
        /// </returns>
        Task<UserAccountLogRDto?> GetUserAccountLogAsync(string id);
    }
}