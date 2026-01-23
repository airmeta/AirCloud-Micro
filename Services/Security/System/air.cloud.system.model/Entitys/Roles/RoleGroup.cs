using air.cloud.security.common.Base;

using System.ComponentModel;

namespace air.cloud.system.model.Entitys.Roles
{
    /// <summary>
    /// 角色组
    /// </summary>
    [Table("SYS_ROLE_GROUP")]
    public  class RoleGroup:CreateEntityBase
    {
        /// <summary>
        /// 角色组名称
        /// </summary>

        [Column("ROLE_GROUP_NAME")]
        public string RoleGroupName { get; set; }

        /// <summary>
        /// 描述
        /// </summary>
        [Column("DESCRIPTION")]
        public string? Description { get; set; }

        /// <summary>
        /// 应用程序信息
        /// </summary>

        [Column("APP_ID")]
        public string AppId { get; set; }
    }
}
