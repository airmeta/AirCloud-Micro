using air.cloud.system.open.service.Dtos.OpenAsgDtos.Check;
using air.cloud.system.open.service.Dtos.OpenAsgDtos.Create;
using air.cloud.system.open.service.Dtos.OpenAsgDtos.Delete;
using air.cloud.system.open.service.Dtos.OpenAsgDtos.Update;

using Air.Cloud.Core.Standard.DynamicServer;

namespace air.cloud.system.open.service.Services.IOpenAsgServices
{
    /// <summary>
    /// <para>zh-cn:开放职位服务接口</para>
    /// <para>en-us:Open Assignment Service Interface</para>
    /// </summary>
    public interface IOpenAsgService:IDynamicService
    {
        /// <summary>
        /// <para>zh-cn:创建开放职位</para>
        /// <para>en-us:Create Open Assignment</para>
        /// </summary>
        /// <param name="dto">
        ///  <para>zh-cn:创建开放职位传输对象</para>
        ///  <para>en-us:Create Open Assignment Data Transfer Object</para>
        /// </param>
        /// <returns>
        ///  <para>zh-cn:创建开放职位结果对象</para>
        ///  <para>en-us:Create Open Assignment Result Object</para>
        /// </returns>
        public Task<OpenAsgCreateResult> OpenAsgCreateAsync(OpenAsgCreateDto dto);

        /// <summary>
        /// <para>zh-cn:更新开放职位</para>
        /// <para>en-us:Update Open Assignment</para>
        /// </summary>
        /// <param name="dto">
        ///  <para>zh-cn:更新开放职位传输对象</para>
        ///  <para>en-us:Update Open Assignment Data Transfer Object</para>
        /// </param>
        /// <returns>
        ///  <para>zh-cn:更新开放职位结果对象</para>
        ///  <para>en-us:Update Open Assignment Result Object</para>
        /// </returns>
        public Task<OpenAsgUpdateResult> OpenAsgUpdateAsync(OpenAsgUpdateDto dto);

        /// <summary>
        /// <para>zh-cn:检查开放职位是否存在</para>
        /// <para>en-us:Check if Open Assignment Exists</para>
        /// </summary>
        /// <param name="AsgId">
        ///  <para>zh-cn:开放职位ID</para>
        ///  <para>en-us:Open Assignment ID</para>
        /// </param>
        /// <returns>
        /// <para>zh-cn:检查开放职位结果对象</para>
        /// <para>en-us:Check Open Assignment Result Object</para>
        /// </returns>
        public Task<OpenAsgCheckResult> OpenAsgCheckAsync(string AsgId);

        /// <summary>
        /// <para>zh-cn:删除开放职位</para>
        /// <para>en-us:Delete Open Assignment</para>
        /// </summary>
        /// <param name="AsgId">
        ///  <para>zh-cn:开放职位ID</para>
        ///  <para>en-us:Open Assignment ID</para>
        /// </param>
        /// <returns>
        ///  <para>zh-cn:删除开放职位结果对象</para>
        ///  <para>en-us:Delete Open Assignment Result Object</para>
        /// </returns>
        public Task<OpenAsgDeleteResult> OpenAsgDeleteAsync(string AsgId);

    }
}
