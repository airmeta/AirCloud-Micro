namespace air.cloud.system.open.service.Dtos.OpenAsgDtos.Check
{
    /// <summary>
    /// <para>zh-cn:开放职位检查结果</para>
    /// <para>en-us:Open Assignment Check Result</para>
    /// </summary>
    public class OpenAsgCheckResult
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
