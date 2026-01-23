namespace air.cloud.system.open.service.Dtos.OpenAsgDtos.Delete
{
    /// <summary>
    /// <para>zh-cn:开放职位删除结果</para>
    /// <para>en-us:Open Assignment Delete Result</para>
    /// </summary>
    public class OpenAsgDeleteResult
    {
        /// <summary>
        /// <para>zh-cn:是否删除成功</para>
        /// <para>en-us:Is Deleted Successfully</para>
        /// </summary>
        public bool IsDelete { get; set; }

        /// <summary>
        /// <para>zh-cn:被删除的开放职位ID</para>
        /// <para>en-us:Deleted Open Assignment ID</para>
        /// </summary>
        public string Id { get; set; }

    }
}
