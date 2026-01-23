namespace air.cloud.system.open.service.Dtos.OpenOrgDtos.Update
{
    /// <summary>
    /// <para>zh-cn:开放组织更新结果</para>
    /// <para>en-us:Open Organization Update Result</para>
    /// </summary>
    public class OpenOrgUpdateResult
    {
        /// <summary>
        /// <para>zh-cn:是否更新成功</para>
        /// <para>en-us:Is Update Successful</para>
        /// </summary>
        public bool IsSuccess { get; set; }

        /// <summary>
        /// <para>zh-cn:开放组织标识</para>
        /// <para>en-us:Open Organization Identifier</para>
        /// </summary>
        public string Id { get; set; }
    }
}
