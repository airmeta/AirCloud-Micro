using air.cloud.security.common.Base;

namespace air.cloud.system.model.Entitys.Apps
{
    /// <summary>
    /// 应用路由授权
    /// </summary>
    [Table("APP_ROUTE_AUTH")]
    public  class AppRouteAuth : CreateEntityBase
    {
        /// <summary>
        /// 应用编号
        /// </summary>
        [Column("APP_ID")]
        public string AppId { get; set; }

        /// <summary>
        /// 路由信息编号
        /// </summary>
        [Column("ROUTE_ID")]
        public string RouteId { get; set; }

    }
}
