namespace air.cloud.system.open.service.Dtos.OpenAsgDtos.Update
{
    /// <summary>
    /// <para>zh-cn:开放职位更新数据传输对象</para>
    /// <para>en-us:Open Assignment Update Data Transfer Object</para>
    /// </summary>
    public class OpenAsgUpdateDto
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

    }
}
