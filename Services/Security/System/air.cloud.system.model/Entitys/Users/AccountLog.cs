using air.cloud.security.common.Base;

namespace air.cloud.system.model.Entitys.Users
{
    /// <summary>
    /// <para>zh-cn:用户账户操作日志</para>
    /// <para>en-us:User account operation log</para>
    /// </summary>
    [Table("SYS_USER_ACCOUNT_LOG")]
    public class UserAccountLog : AllEntityBase
    {
        /// <summary>
        /// <para>zh-cn:用户ID</para>
        /// <para>en-us:User Id</para>
        /// </summary>
        [Column("USER_ID")]
        public string UserId { get; set; }

        /// <summary>
        /// <para>zh-cn:类型编码</para>
        /// <para>en-us:Type code</para>
        /// </summary>
        [Column("TYPE_CODE")]
        public string TypeCode { get; set; }

        /// <summary>
        /// <para>zh-cn:扩展字段（CLOB）</para>
        /// <para>en-us:Meta information (CLOB)</para>
        /// </summary>
        [Column("META", TypeName = "CLOB")]
        public string? Meta { get; set; }

        /// <summary>
        /// <para>zh-cn:备注</para>
        /// <para>en-us:Remark</para>
        /// </summary>
        [Column("REMARK")]
        public string? Remark { get; set; }
    }
}