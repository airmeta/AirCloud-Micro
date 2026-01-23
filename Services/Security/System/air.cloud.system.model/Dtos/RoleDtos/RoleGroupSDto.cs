namespace air.cloud.system.model.Dtos.RoleDtos
{
    public class RoleGroupSDto
    {

        /// <summary>
        /// 编号
        /// </summary>
        public string Id { get; set; }

        /// <summary>
        /// 角色组名称
        /// </summary>
        public string RoleGroupName { get; set; }

        /// <summary>
        /// 描述
        /// </summary>
        public string Description { get; set; } 

        /// <summary>
        /// 应用程序信息
        /// </summary>
        public string AppId
        {
            get; set;

        }
    }
}
