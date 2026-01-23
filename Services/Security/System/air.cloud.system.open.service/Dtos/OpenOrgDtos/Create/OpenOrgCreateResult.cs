namespace air.cloud.system.open.service.Dtos.OpenOrgDtos.Create
{

    /// <summary>
    /// <para>zh-cn:开放组织创建结果</para>
    /// <para>en-us:Open Organization Create Result</para>  
    /// </summary>
    public class OpenOrgCreateResult
    {
        /// <summary>
        /// <para>zh-cn:是否创建成功</para>
        /// <para>en-us:Is Creation Successful</para>
        /// </summary>
        public bool IsSuccess { get; set; }

        /// <summary>
        /// <para>zh-cn:创建的组织ID</para>
        /// <para>en-us:Created Organization ID</para>
        /// </summary>
        public string Id { get; set; }

    }
}
