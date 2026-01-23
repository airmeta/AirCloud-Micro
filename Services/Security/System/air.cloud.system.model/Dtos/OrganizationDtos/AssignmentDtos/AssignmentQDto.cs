using air.cloud.security.common.Base.Dtos;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace air.cloud.system.model.Dtos.OrganizationDtos.AssignmentDtos
{
    /// <summary>
    /// <para>zh-cn:职位查询数据传输对象</para>
    /// <para>en-us:Assignment Query Data Transfer Object</para>
    /// </summary>
    public class AssignmentQDto:BaseQDto
    {

        /// <summary>
        /// <para>zh-cn:部门编号</para> 
        /// <para>en-us:Department Id</para>
        /// </summary>
        public string DepartmentId { get; set; }

    }
}
