namespace air.cloud.system.open.service.Dtos.OpenAsgDtos.Create
{
    /// <summary>
    /// <para>zh-cn:开放职位创建结果</para>
    /// <para>en-us:Open Assignment Create Result</para>  
    /// </summary>
    public class OpenAsgCreateResult
    {
        /// <summary>
        /// <para>zh-cn:是否创建成功</para>
        /// <para>en-us:Is Creation Successful</para>
        /// </summary>
        public bool IsSuccess { get; set; }

        /// <summary>
        /// <para>zh-cn:职位Id</para>
        /// <para>en-us:Assignment Id</para>
        /// </summary>
        public string Id { get; set; }

    }
}
