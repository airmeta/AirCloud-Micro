namespace air.cloud.security.common.Base.Dtos
{
    /// <summary>
    /// <para>zh-cn:基础查询传输对象</para>
    /// <para>en-us:Base Query Data Transfer Object</para>
    /// </summary>
    public class BaseQDto
    {
        /// <summary>
        /// <para>zh-cn:页码</para>
        /// <para>en-us:Page Number</para>  
        /// </summary>
        public int Page { get; set; } = 0;

        /// <summary>
        /// <para>zh-cn:每页数量</para>
        /// <para>en-us:Items Per Page</para>
        /// </summary>
        public int Limit { get; set; } = 0;

        /// <summary>
        /// <para>zh-cn:查询信息</para>
        /// <para>en-us:Query Information</para>    
        /// </summary>
        public string Info { get; set; }

        /// <summary>
        /// <para>zh-cn:应用标识</para>
        /// <para>en-us:Application Identifier</para>
        /// </summary>
        public string AppId { get; set; }


    }
}
