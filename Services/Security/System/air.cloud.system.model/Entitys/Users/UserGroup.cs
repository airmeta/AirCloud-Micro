using air.cloud.security.common.Base;

namespace air.cloud.system.model.Entitys.Users
{
    /// <summary>
    /// <para>用户组实体</para>
    /// </summary>
    [Table("SYS_USER_GROUP")]
    public class UserGroup:AllEntityBase
    {
        /// <summary>
        /// 用户组名称
        /// </summary>
        [Column("GROUP_NAME")]
        public string GroupName { get; set; }

        /// <summary>
        /// 应用程序信息
        /// </summary>
        [Column("APP_ID")]
        public string AppId { get; set; }

        /// <summary>
        /// 描述信息
        /// </summary>
        [Column("DESCRIPTION")]
        public string? Description { get; set; }

    }
}
