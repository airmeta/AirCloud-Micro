using air.cloud.security.common.Base;

namespace air.cloud.system.model.Entitys.Roles
{
    /// <summary>
    /// 权限信息
    /// </summary>
    [Table("SYS_ACTION_PERMISSION")]
    public  class ActionPermission:CreateEntityBase
    {

        /// <summary>
        /// 权限标识
        /// </summary>
        [Column("VALUE")]
        public string Value { get; set; }

        /// <summary>
        /// <para>权限描述</para>
        /// </summary>

        [Column("DESCRIPTION")]
        public string? Description { get; set; }

        /// <summary>
        /// 服务名
        /// </summary>
        [Column("SERVICE_NAME")]
        public string ServiceName { get; set; }

        /// <summary>
        /// 应用程序信息
        /// </summary>

        [Column("APP_ID")]
        public string AppId { get; set; }
    }
}
