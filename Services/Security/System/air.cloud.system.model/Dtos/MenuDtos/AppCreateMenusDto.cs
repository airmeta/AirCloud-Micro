using air.cloud.security.common.Enums;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace air.cloud.system.model.Dtos.MenuDtos
{
    public  class AppCreateMenusDto
    {
        public string Id { get; set; }
        #region 字段
        /// <summary>
        /// 菜单分类
        /// </summary>
        public MenuTypeEnum Type { get; set; } = MenuTypeEnum.目录;

        /// <summary>
        /// 上级菜单ID
        /// </summary>
        public string ParentId { get; set; }

        /// <summary>
        /// 菜单名
        /// </summary>
        public string Title { get; set; }

        /// <summary>
        /// 图标
        /// </summary>
        public string Icon { get; set; }

        /// <summary>
        /// 前端路由地址
        /// </summary>
        public string Path { get; set; }

        /// <summary>
        /// 前端组件地址
        /// </summary>
        public string Component { get; set; }

        /// <summary>
        /// 是否隐藏（1是，0否）
        /// </summary>
        public IsOrNotEnum Hide { get; set; }

        /// <summary>
        /// 排序号
        /// </summary>
        public int? SortNumber { get; set; }


        /// <summary>
        /// 权限信息
        /// </summary>
        public string? Authority { get; set; }


        /// <summary>
        /// 应用程序信息
        /// </summary>
        public string AppId { get; set; }
        #endregion

        /// <summary>
        /// 子菜单
        /// </summary>
        public IList<AppCreateMenusDto>? Children { get; set; }
    }
}
