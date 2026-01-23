namespace air.cloud.system.model.Dtos.PermissionDtos
{
    public class ActionPermissionSDto
    {

        public string Id { get; set; }
        /// <summary>
        /// 权限标识
        /// </summary>
        public string Value { get; set; }

        /// <summary>
        /// <para>权限描述</para>
        /// </summary>
        public string Description { get; set; }

        /// <summary>
        /// 服务名
        /// </summary>
        public string ServiceName { get; set; }
        /// <summary>
        /// 应用程序信息
        /// </summary>
        public string AppId
        {
            get; set;
        }
    }
}
