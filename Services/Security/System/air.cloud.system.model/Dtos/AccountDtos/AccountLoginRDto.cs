using air.cloud.security.common.Enums;

namespace air.cloud.system.model.Dtos.AccountDtos
{
    /// <summary>
    /// 账户登录响应结果
    /// </summary>
    public  class AccountLoginRDto
    {
        /// <summary>
        /// 登录状态
        /// </summary>
        public AccountStatusEnum AccountStatus  { get; set; }

        /// <summary>
        /// Ticket 信息
        /// </summary>
        public string Ticket { get; set; }

        /// <summary>
        /// <para>zh-cn:客户端随机编码</para>
        /// </summary>
        public string ClientUUID { get; set; }


        /// <summary>
        /// Ticket 过期时间
        /// </summary>
        public string ExpiredTime { get; set; }
        /// <summary>
        /// 附加载荷信息
        /// </summary>
        public IDictionary<string,string> Payload { get; set; }

        /// <summary>
        /// 是否启用多因素认证
        /// </summary>
        public IsOrNotEnum EnableMFA { get; set; }

    }
    public enum AccountStatusEnum
    {
        登录成功,
        登录失败,
        账户或密码错误,
        账户被禁用,
        账户已过期,
        密码已过期
    }
}
