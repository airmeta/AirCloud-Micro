using air.cloud.security.common.Base;

using System.ComponentModel.DataAnnotations.Schema;

namespace air.cloud.system.model.Entitys.Dictonrays
{
    /// <summary>
    /// <para>zh-cn:字典配置实体</para>
    /// <para>en-us:Dictionary configuration entity</para>
    /// </summary>
    [Table("DICTIONARY_CONFIG")]
    public class DictionaryConfig:AllEntityBase
    {

        /// <summary>
        /// <para>zh-cn:父级ID</para>
        /// <para>en-us:Parent Id</para>
        /// </summary>
        [Column("PARENT_ID")]
        public string? ParentId { get; set; }

        /// <summary>
        /// <para>zh-cn:编码</para>
        /// <para>en-us:Code</para>
        /// </summary>
        [Column("CODE")]
        public string Code { get; set; }

        /// <summary>
        /// <para>zh-cn:标签</para>
        /// <para>en-us:Label</para>
        /// </summary>
        [Column("LABEL")]
        public string Label { get; set; }

        /// <summary>
        /// <para>zh-cn:值</para>
        /// <para>en-us:Value</para>
        /// </summary>
        [Column("VALUE")]
        public string Value { get; set; }

        /// <summary>
        /// <para>zh-cn:描述</para>
        /// <para>en-us:Description</para>
        /// </summary>
        [Column("DESCRIPTION")]
        public string? Description { get; set; }

        /// <summary>
        /// <para>zh-cn:扩展字段</para>
        /// <para>en-us:Meta</para>
        /// </summary>
        [Column("META", TypeName = "CLOB")]
        public string? Meta { get; set; }
    }
}