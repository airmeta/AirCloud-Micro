using air.cloud.security.common.Base.Dtos;

namespace air.cloud.system.model.Dtos.UserDtos
{
    /// <summary>
    /// <para>zh-cn:用户查询传输对象</para>
    /// <para>en-us:User Query Dto</para>
    /// </summary>
    public class UserQDto:BaseQDto
    {
        /// <summary>
        /// <para>zh-cn:部门编号</para>
        /// <para>en-us:Department Id</para>
        /// </summary>
        public string? DepartmentId { get; set; }

        /// <summary>
        /// <para>zh-cn:角色编号</para>
        /// <para>en-us:Role Id</para>
        /// </summary>
        public string? RoleId { get; set; }

    }
}
