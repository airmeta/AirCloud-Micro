namespace air.cloud.system.open.service.Dtos.OpenUserDtos.Delete
{
    /// <summary>
    /// <para>zh-cn:开放用户删除结果</para>
    /// <para>en-us:Open User Delete Result</para>
    /// </summary>
    public class OpenUserDeleteResult
    {
        /// <summary>
        /// <para>zh-cn:是否删除成功</para>   
        /// <para>en-us:Is Deletion Successful</para>   
        /// </summary>
        public bool IsDelete { get; set; }

        /// <summary>
        /// <para>zh-cn:被删除的开放组织ID</para>
        /// <para>en-us:ID of the Deleted Open Organization</para>
        /// </summary>
        public string AppUserId { get; set; }
    }
}
