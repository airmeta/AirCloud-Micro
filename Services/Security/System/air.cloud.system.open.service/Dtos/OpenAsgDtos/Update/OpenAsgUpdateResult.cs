namespace air.cloud.system.open.service.Dtos.OpenAsgDtos.Update
{
    /// <summary>
    /// <para>zh-cn:开放职位更新结果</para>
    /// <para>en-us:Open Assignment Update Result</para>
    /// </summary>
    public class OpenAsgUpdateResult
    {
        /// <summary>
        /// <para>zh-cn:是否更新成功</para>
        /// <para>en-us:Is Update Successful</para>
        /// </summary>
        public bool IsSuccess { get; set; }
        /// <summary>
        /// <para>zh-cn:开放职位标识</para>
        /// <para>en-us:Open Assignment Identifier</para>
        /// </summary>
        public string Id { get; set; }
    }
}
