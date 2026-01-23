namespace air.cloud.system.open.service.Dtos.OpenAccountDtos
{
    /// <summary>
    /// <para>zh-cn:开放账户详情查询请求参数DTO</para>
    /// <para>en-us:Open Account Detail Query Request Parameter DTO</para>
    /// </summary>
    public class OpenAccountDetailQDto
    {
        /// <summary>
        /// <para>zh-cn:待核票据(使用应用私钥加密)</para>
        /// <para>en-us:Ticket to be verified(使用应用私钥加密)</para>
        /// </summary>
        public string Ticket { get; set; }

    }
}
