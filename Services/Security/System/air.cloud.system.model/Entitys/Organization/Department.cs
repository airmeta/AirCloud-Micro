using air.cloud.system.model.Dtos.OrganizationDtos.DepartmentDtos;
using air.cloud.security.common.Base;

namespace air.cloud.system.model.Entitys.Organization
{
    [Table("SYS_DEPARTMENT")]
    public  class Department:AllEntityBase
    {
        /// <summary>
        /// <para>部门名称</para>
        /// </summary>
        [Column("DEPARTMENT_NAME")]
        public string DepartmentName { get; set; }

        /// <summary>
        /// <para>部门编码</para>
        /// </summary>
        /// <remarks>
        ///  部门编码用于唯一标识一个部门, 通常由字母和数字组成, 例如 "HR001" 代表人力资源部. 全局不重复
        /// </remarks>
        [Column("DEPARTMENT_CODE")]
        public string DepartmentCode { get; set; }

        /// <summary>
        /// 部门描述
        /// </summary>
        [Column("DESCRIPTION")]
        public string? Description { get; set; }

        /// <summary>
        /// <para>上级部门ID</para>
        /// </summary>
        /// <remarks>
        /// parentDepartmentId 用于表示当前部门的上级部门的唯一标识符.如果一个部门没有上级部门, 则该字段的值为 0000000000000000000000000000000.
        /// </remarks>
        [Column("PARENT_DEPARTMENT_ID")]
        public string ParentDepartmentId { get; set; } = DepartmentSDto.TOP_DEPARTMENT_ID;

        /// <summary>
        /// <para>zh-cn:所属应用</para>
        /// <para>en-us:Belonging Application</para>
        /// </summary>
        [Column("APP_ID")]
        public string AppId { get; set; }


        #region  生成树

        /// <summary>
        /// 生成部门树信息
        /// </summary>
        /// <param name="departments"></param>
        /// <returns></returns>
        public static List<DepartmentTreeDto> CreatTree(List<Department> departments)
        {

            List<DepartmentTreeDto> departmentTreeDtos = departments.Where(s => s.ParentDepartmentId == DepartmentSDto.TOP_DEPARTMENT_ID).Select(d => new DepartmentTreeDto()
            {
                Code = d.DepartmentCode,
                Description = d.Description,
                Name = d.DepartmentName,
                ParentId = string.Empty,
                AppId = d.AppId,
                Id = d.Id,
                Children = new List<DepartmentTreeDto>()
            }).ToList();

            foreach (var department in departmentTreeDtos)
            {
                department.Children = CreatTree(department, departments);
            }
            return departmentTreeDtos;
        }

        /// <summary>
        /// 生成树信息
        /// </summary>
        /// <param name="departmentTreeDto"></param>
        /// <param name="departments"></param>
        /// <returns></returns>
        private static List<DepartmentTreeDto> CreatTree(DepartmentTreeDto departmentTreeDto, List<Department> departments)
        {
            var Childrens = departments.Where(s => s.ParentDepartmentId == departmentTreeDto.Id).Select(d =>
            {
                var department = new DepartmentTreeDto()
                {
                    Code = d.DepartmentCode,
                    Description = d.Description,
                    Name = d.DepartmentName,
                    ParentId = departmentTreeDto.Id,
                    AppId = departmentTreeDto.AppId,
                    Id = d.Id
                };
                department.Children = CreatTree(department, departments);
                return department;
            }).ToList();
            return Childrens;
        }

        #endregion


    }
}
