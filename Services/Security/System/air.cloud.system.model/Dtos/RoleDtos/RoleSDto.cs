namespace air.cloud.system.model.Dtos.RoleDtos
{
    /// <summary>
    /// <para>zh-cn:角色保存模型</para>
    /// <para>en-us:Role Save Model</para>
    /// </summary>
    public class RoleSDto
    {
        /// <summary>
        /// <para>zh-cn:角色标识</para>
        /// <para>en-us:Role Id</para>
        /// </summary>
        public string Id { get; set; }
        /// <summary>
        /// <para>zh-cn:角色名称</para>
        /// <para>en-us:Role Name</para>
        /// </summary>
        public string RoleName { get; set; }

        /// <summary>
        /// <para>zh-cn:角色描述</para> 
        /// <para>en-us:Role Description</para>
        /// </summary>
        public string Description { get; set; }
        /// <summary>
        /// <para>zh-cn:应用标识</para>
        /// <para>en-us:Application Id</para>
        /// </summary>
        public string AppId { get; set; }
        /// <summary>
        ///  <para>zh-cn:从指定角色复制菜单权限,动作权限  可空</para>
        ///  <para>en-us:Copy menu permissions and action permissions from the specified role  Optional</para>
        /// </summary>
        public string TargetId { get; set; }

    }
}
