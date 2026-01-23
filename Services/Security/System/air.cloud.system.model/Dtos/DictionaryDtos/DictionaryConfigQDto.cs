using air.cloud.security.common.Base.Dtos;

namespace air.cloud.system.model.Dtos.DictionaryDtos
{
    /// <summary>
    /// <para>zh-cn:字典配置查询传输对象</para>
    /// <para>en-us:Dictionary configuration query DTO</para>
    /// </summary>
    public class DictionaryConfigQDto : BaseQDto
    {
        /// <summary>
        /// <para>zh-cn:父级ID（可选）</para>
        /// <para>en-us:Parent Id (optional)</para>
        /// </summary>
        public string? ParentId { get; set; }

        /// <summary>
        /// <para>zh-cn:编码（可选，支持模糊匹配）</para>
        /// <para>en-us:Code (optional, supports fuzzy match)</para>
        /// </summary>
        public string? Code { get; set; }

        /// <summary>
        /// <para>zh-cn:标签（可选，支持模糊匹配）</para>
        /// <para>en-us:Label (optional, supports fuzzy match)</para>
        /// </summary>
        public string? Label { get; set; }
    }
}