using air.cloud.security.common.Base;

namespace air.cloud.system.model.Entitys.Roles
{
    /// <summary>
    /// 角色信息
    /// </summary>
    [Table("SYS_ROLE")]
    public  class Role:CreateEntityBase
    {
        /// <summary>
        /// 角色名
        /// </summary>

        [Column("ROLE_NAME")]
        public string RoleName { get; set; }


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
