namespace air.cloud.system.model.Dtos.OrganizationDtos.AssignmentDtos
{

    /// <summary>
    /// <para>zh-cn:职位保存模型</para>
    /// <para>en-us:Assignment Save Data Transfer Object</para>
    /// </summary>
    public class AssignmentSDto
    {
        /// <summary>
        /// <para>zh-cn:职位ID</para>
        /// <para>en-us:Assignment Id</para>
        /// </summary>
        public string Id { get; set; }

        /// <summary>
        /// <para>zh-cn:职位名称</para>
        /// <para>en-us:Assignment Name</para>
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// <para>zh-cn:职位描述</para>
        /// <para>en-us:Assignment Description</para>
        /// </summary>
        public string Description { get; set; }

        /// <summary>
        /// <para>zh-cn:所属部门ID</para>
        /// <para>en-us:Department Id</para>
        /// </summary>
        public string DepartmentId { get; set; }

        /// <summary>
        /// <para>zh-cn:应用ID</para>
        /// <para>en-us:Application Id</para>
        /// </summary>
        public string AppId { get; set; }

    }
}
