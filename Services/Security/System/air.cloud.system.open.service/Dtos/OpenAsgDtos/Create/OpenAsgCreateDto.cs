namespace air.cloud.system.open.service.Dtos.OpenAsgDtos.Create
{
    /// <summary>
    /// <para>zh-cn:开放职位创建数据传输对象</para>
    /// <para>en-us:Open Assignment Create Data Transfer Object</para>
    /// </summary>
    public class OpenAsgCreateDto
    {
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

    }
}
