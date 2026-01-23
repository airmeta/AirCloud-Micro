namespace air.cloud.system.model.Dtos.MenuDtos
{
    /// <summary>
    /// <para>zh-cn:角色菜单返回DTO</para>
    /// <para>en-us:Role Menu Return DTO</para>
    /// </summary>
    public class RoleMenusRDto:MenuSDto
    {
        /// <summary>
        /// <para>zh-cn:菜单是否选中</para>
        /// <para>en-us:Is the menu selected</para>
        /// </summary>
        public bool Checked { get; set; }
    }
}
