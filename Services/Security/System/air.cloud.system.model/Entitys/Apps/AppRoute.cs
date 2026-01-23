using air.cloud.security.common.Base;

namespace air.cloud.system.model.Entitys.Apps
{
    /// <summary>
    /// 应用路由
    /// </summary>
    [Table("APP_ROUTE")]
    public  class AppRoute:CreateEntityBase
    {
        /// <summary>
        /// 应用编号
        /// </summary>
        [Column("APP_ID")]
        public string AppId { get; set; }
        /// <summary>
        /// 路由地址
        /// </summary>
        [Column("ROUTE")]
        public string Route { get; set; }

        /// <summary>
        /// 描述
        /// </summary>
        [Column("DESCRIPTION")]
        public string Description { get; set; }

    }
}
