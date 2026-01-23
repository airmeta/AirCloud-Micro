namespace air.cloud.system.model.Dtos.AccountDtos
{
    public  class AccountAppIdsRDto
    {
        /// <summary>
        /// 应用ID
        /// </summary>
        public string AppId { get; set; }

        /// <summary>
        /// 应用名称
        /// </summary>
        public string AppName { get; set; }

        /// <summary>
        /// 应用重定向地址
        /// </summary>
        public string AppRedirectUrl { get; set; }

        /// <summary>
        /// 应用重定向Key
        /// </summary>
        public string AppRedirectKey { get; set; }


        /// <summary>
        /// 图片地址
        /// </summary>
        public string LogoUrl { get; set; }

        /// <summary>
        /// 应用描述
        /// </summary>
        public string Description { get; set; }

        /// <summary>
        /// 创建时间
        /// </summary>
        public DateTime? CreateTime { get; set; }

    }
}
