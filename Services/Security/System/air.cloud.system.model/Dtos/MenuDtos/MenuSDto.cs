using air.cloud.security.common.Enums;

namespace air.cloud.system.model.Dtos.MenuDtos
{
    /// <summary>
    /// <para>zh-cn:菜单创建数据传输对象</para>
    /// <para>en-us:Menu Create Data Transfer Object</para>
    /// </summary>
    public class MenuSDto
    {
        /// <summary>
        /// <para>zh-cn:菜单ID</para>
        /// <para>en-us:Menu ID</para>
        /// </summary>
        public string Id { get; set; }
        #region 字段
        /// <summary>
        /// <para>zh-cn:菜单类型（目录、菜单、按钮）</para>
        /// <para>en-us:Menu Type (Directory, Menu, Button)</para>
        /// </summary>
        public MenuTypeEnum Type { get; set; } = MenuTypeEnum.目录;

        /// <summary>
        /// <para>zh-cn:父级菜单ID</para>
        /// <para>en-us:Parent Menu ID</para>
        /// </summary>
        public string? ParentId { get; set; }

        /// <summary>
        /// <para>zh-cn:菜单标题</para>
        /// <para>en-us:Menu Title</para>
        /// </summary>
        public string Title { get; set; }

        /// <summary>
        /// <para>zh-cn:菜单图标</para>
        /// <para>en-us:Menu Icon</para>
        /// </summary>
        public string Icon { get; set; }

        /// <summary>
        /// <para>zh-cn:前端路由地址</para>
        /// <para>en-us:Front-end Route Address</para>
        /// </summary>
        public string Path { get; set; }

        /// <summary>
        /// <para>zh-cn:前端组件地址</para>
        /// <para>en-us:Front-end Component Address</para>
        /// </summary>
        public string Component { get; set; }

        /// <summary>
        /// <para>zh-cn:菜单是否隐藏</para>
        /// <para>en-us:Menu Hidden</para>
        /// </summary>
        public IsOrNotEnum Hide { get; set; }

        /// <summary>
        /// <para>zh-cn:菜单排序号</para>
        /// <para>en-us:Menu Sort Number</para>
        /// </summary>
        public int? SortNumber { get; set; }


        /// <summary>
        /// <para>zh-cn:权限标识</para>
        /// <para>en-us:Authority Identifier</para>
        /// </summary>
        public string? Authority { get; set; }


        /// <summary>
        /// <para>zh-cn:所属应用ID</para>
        /// <para>en-us:Application ID</para>
        /// </summary>
        public string AppId { get; set; }
        #endregion
    }
}
