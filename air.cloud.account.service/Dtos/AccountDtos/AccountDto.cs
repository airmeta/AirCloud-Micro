namespace air.cloud.account.service.Dtos.AccountDtos
{
    /// <summary>
    /// <para>zh-cn:账户数据传输对象</para>
    /// <para>en-us:Account Data Transfer Object</para>
    /// </summary>
    public  class AccountDto
    {  
        /// <summary>
        /// <para>zh-cn:登录内容(调用方做加密)</para>
        /// <para>en-us:Login Content (encrypted by caller)</para>
        /// </summary>
        public string Content { get; set; }

    }
}
