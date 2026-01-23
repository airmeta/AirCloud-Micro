namespace air.cloud.system.open.service.Dtos.OpenUserDtos.Update
{
    /// <summary>
    /// <para>zh-cn:开放用户更新结果</para>
    /// <para>en-us:Open User Update Result</para>
    /// </summary>
    public class OpenUserUpdateResult
    {
        /// <summary>
        /// <para>zh-cn:是否更新成功</para>
        /// <para>en-us:Is Update Successful</para>
        /// </summary>
        public bool IsSuccess { get; set; }
        /// <summary>
        /// <para>zh-cn:更新的用户ID</para>
        /// <para>en-us:Updated User ID</para>
        /// </summary>
        public string Id { get; set; }
    }
}
