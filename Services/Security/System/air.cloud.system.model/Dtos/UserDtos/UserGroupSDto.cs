namespace air.cloud.system.model.Dtos.UserDtos
{
    public  class UserGroupSDto
    {
        public string Id { get; set; }
        /// <summary>
        /// 用户组名称
        /// </summary>
        public string GroupName { get; set; }


        /// <summary>
        /// 用户组描述
        /// </summary>
        public string Description { get; set; }

        /// <summary>
        /// 应用程序信息
        /// </summary>
        public string AppId { get; set; }

    }
}
