namespace air.cloud.system.open.service.Dtos.OpenUserDtos.Create
{
    /// <summary>
    /// <para>zh-cn:开放用户创建结果</para>
    /// <para>en-us:Open User Create Result</para>
    /// </summary>
    public class OpenUserCreateResult
    {
        /// <summary>
        /// <para>zh-cn:是否创建成功</para>
        /// <para>en-us:Is Creation Successful</para>
        /// </summary>
        public bool IsSuccess { get; set; }

        /// <summary>
        /// <para>zh-cn:创建的用户ID</para>
        /// <para>en-us:Created User ID</para>  
        /// </summary>
        public string Id { get; set; }
    }
}
