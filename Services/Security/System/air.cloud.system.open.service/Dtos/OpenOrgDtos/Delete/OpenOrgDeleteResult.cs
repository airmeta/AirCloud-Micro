namespace air.cloud.system.open.service.Dtos.OpenOrgDtos.Delete
{
    /// <summary>
    /// <para>zh-cn:开放组织删除结果</para>
    /// <para>en-us:Open Organization Delete Result</para>
    /// </summary>
    public class OpenOrgDeleteResult
    {
        /// <summary>
        /// <para>zh-cn:是否删除成功</para>
        /// <para>en-us:Whether Deletion was Successful</para>
        /// </summary>
        public bool IsDelete { get; set; }
        /// <summary>
        /// <para>zh-cn:被删除的开放组织ID</para>
        /// <para>en-us:ID of the Deleted Open Organization</para>
        /// </summary>
        public string Id { get; set; }

    }
}
