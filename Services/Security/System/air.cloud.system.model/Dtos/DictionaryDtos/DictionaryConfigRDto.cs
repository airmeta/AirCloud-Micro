namespace air.cloud.system.model.Dtos.DictionaryDtos
{
    /// <summary>
    /// <para>zh-cn:字典配置返回传输对象</para>
    /// <para>en-us:Dictionary configuration response DTO</para>
    /// </summary>
    public class DictionaryConfigRDto
    {
        /// <summary>
        /// <para>zh-cn:字典配置ID</para>
        /// <para>en-us:Dictionary config Id</para>
        /// </summary>
        public string Id { get; set; }

        /// <summary>
        /// <para>zh-cn:父级ID</para>
        /// <para>en-us:Parent Id</para>
        /// </summary>
        public string? ParentId { get; set; }

        /// <summary>
        /// <para>zh-cn:编码</para>
        /// <para>en-us:Code</para>
        /// </summary>
        public string Code { get; set; }

        /// <summary>
        /// <para>zh-cn:标签</para>
        /// <para>en-us:Label</para>
        /// </summary>
        public string Label { get; set; }

        /// <summary>
        /// <para>zh-cn:值</para>
        /// <para>en-us:Value</para>
        /// </summary>
        public string Value { get; set; }

        /// <summary>
        /// <para>zh-cn:描述</para>
        /// <para>en-us:Description</para>
        /// </summary>
        public string? Description { get; set; }

        /// <summary>
        /// <para>zh-cn:扩展字段（与数据库CLOB对应）</para>
        /// <para>en-us:Meta info (mapped to CLOB in DB)</para>
        /// </summary>
        public string? Meta { get; set; }
    }
}