namespace air.cloud.system.open.service.Dtos.OpenUserDtos.Check
{
    /// <summary>
    /// <para>zh-cn:开放用户检查结果</para>
    /// <para>en-us:Open User Check Result</para>
    /// </summary>
    public class OpenUserCheckResult
    {
        /// <summary>
        /// <para>zh-cn:是否存在</para>
        /// <para>en-us:Is Exits</para>
        /// </summary>
        public bool IsExits { get; set; }

        /// <summary>
        /// <para>zh-cn:检查结果代码</para>   
        /// <para>en-us:Check Result Code</para>
        /// </summary>
        public string Code { get; set; }

    }
}
