namespace air.cloud.account.service.Dtos.AccountDtos
{
    /// <summary>
    /// <para>zh-cn:重置密码数据传输对象</para>
    /// <para>en-us:Reset Password Data Transfer Object</para>
    /// </summary>
    public class ResetPasswordDto
    {
        /// <summary>
        /// <para>zh-cn:用户ID</para>
        /// <para>en-us:User Id</para>
        /// </summary>
        public string UserId { get; set; }
        /// <summary>
        /// <para>zh-cn:验证码</para>
        /// <para>en-us:Verification Code</para>
        /// </summary>
        public string Code { get; set; }
    }
}
