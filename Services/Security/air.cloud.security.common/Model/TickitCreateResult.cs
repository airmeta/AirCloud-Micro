namespace air.cloud.security.common.Model
{
    /// <summary>
    /// <para>zh-cn:票据创建结果</para>
    /// <para>en-us:Ticket Create Result</para>
    /// </summary>
    public class TicketCreateResult
    {
        /// <summary>
        /// <para>zh-cn:状态码</para>
        /// <para>en-us:Status Code</para>
        /// </summary>
        /// <remarks>
        ///  <para>zh-cn:默认200表示成功</para>
        /// </remarks>
        public int Code { get; set; } = 200;

        /// <summary>
        /// <para>zh-cn:提示消息</para>
        /// <para>en-us:Message</para>
        /// </summary>
        public string Message { get; set; }


        /// <summary>
        /// 过期时间(字符串)
        /// </summary>
        public string ExpiredTime { get=> ExpiredAt.ToString("yyyy-MM-dd HH:mm:ss"); }

        /// <summary>
        /// 过期时间
        /// </summary>
        public DateTime ExpiredAt { get; set; }


        /// <summary>
        /// 用户信息载荷(可返回给前端)
        /// </summary>
        public IDictionary<string,string>  Payload { get; set; }

        /// <summary>
        /// <para>zh-cn:票据</para>
        /// <para>en-us:Ticket</para>
        /// </summary>
        public string  Ticket { get; set; }

        /// <summary>
        /// <para>zh-cn:生成的随机客户端码</para>
        /// </summary>
        public string ClientId { get; set; }


    }
}
