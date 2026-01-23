using air.cloud.security.common.Model;
using air.cloud.system.model.Dtos.DictionaryDtos;

using Air.Cloud.Core.Standard.DynamicServer;

namespace air.cloud.system.service.Services.DictionaryServices
{
    /// <summary>
    /// <para>zh-cn:字典配置服务接口</para>
    /// <para>en-us:Dictionary configuration service interface</para>
    /// </summary>
    public interface IDictionaryConfigService : IDynamicService
    {
        /// <summary>
        /// <para>zh-cn:创建或更新字典配置</para>
        /// <para>en-us:Create or update dictionary configuration</para>
        /// </summary>
        /// <param name="dto">
        ///  <para>zh-cn:字典配置保存传输对象</para>
        ///  <para>en-us:Dictionary configuration save DTO</para>
        /// </param>
        /// <returns>
        ///  <para>zh-cn:返回保存结果，true表示成功，false表示失败</para>
        ///  <para>en-us:Returns the save result, true indicates success, false indicates failure</para>
        /// </returns>
        Task<bool> SaveDictionaryConfigAsync(DictionaryConfigSDto dto);

        /// <summary>
        /// <para>zh-cn:删除字典配置</para>
        /// <para>en-us:Delete dictionary configuration</para>
        /// </summary>
        /// <param name="id">
        ///  <para>zh-cn:字典配置ID</para>
        ///  <para>en-us:Dictionary configuration Id</para>
        /// </param>
        /// <returns>
        ///  <para>zh-cn:返回删除结果，true表示成功，false表示失败</para>
        ///  <para>en-us:Returns the deletion result, true indicates success, false indicates failure</para>
        /// </returns>
        Task<bool> DeleteDictionaryConfigAsync(string id);

        /// <summary>
        /// <para>zh-cn:分页查询字典配置</para>
        /// <para>en-us:Query dictionary configurations with paging</para>
        /// </summary>
        /// <param name="dto">
        ///  <para>zh-cn:字典配置查询参数</para>
        ///  <para>en-us:Dictionary configuration query parameters</para>
        /// </param>
        /// <returns>
        ///  <para>zh-cn:分页结果（返回视图对象）</para>
        ///  <para>en-us:Paged result (response DTO)</para>
        /// </returns>
        Task<PageList<DictionaryConfigRDto>> QueryDictionaryConfigsAsync(DictionaryConfigQDto dto);

        /// <summary>
        /// <para>zh-cn:树形查询字典配置</para>
        /// <para>en-us:Query dictionary configurations as tree</para>
        /// </summary>
        /// <param name="dto">
        ///  <para>zh-cn:字典配置查询参数</para>
        ///  <para>en-us:Dictionary configuration query parameters</para>
        /// </param>
        /// <returns>
        ///  <para>zh-cn:树形结构的字典配置列表</para>
        ///  <para>en-us:Tree-structured dictionary configuration list</para>
        /// </returns>
        Task<List<DictionaryConfigTreeRDto>> QueryDictionaryConfigTreeAsync(DictionaryConfigQDto dto);

        /// <summary>
        /// <para>zh-cn:获取字典配置详情</para>
        /// <para>en-us:Get dictionary configuration detail</para>
        /// </summary>
        /// <param name="id">
        ///  <para>zh-cn:字典配置ID</para>
        ///  <para>en-us:Dictionary configuration Id</para>
        /// </param>
        /// <returns>
        ///  <para>zh-cn:字典配置返回传输对象</para>
        ///  <para>en-us:Dictionary configuration response DTO</para>
        /// </returns>
        Task<DictionaryConfigRDto?> GetDictionaryConfigAsync(string id);
    }
}