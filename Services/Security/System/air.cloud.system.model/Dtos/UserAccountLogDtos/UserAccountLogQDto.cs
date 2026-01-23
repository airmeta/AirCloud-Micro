using air.cloud.security.common.Base.Dtos;

using System;

namespace air.cloud.system.model.Dtos.UserAccountLogDtos
{
    /// <summary>
    /// <para>zh-cn:用户账户日志保存传输对象</para>
    /// <para>en-us:User account log save DTO</para>
    /// </summary>
    public class UserAccountLogQDto :BaseQDto
    {
        /// <summary>
        /// <para>zh-cn:用户编号</para>
        /// <para>en-us:User Id</para>
        /// </summary>
        public string UserId { get; set; }

    }
}