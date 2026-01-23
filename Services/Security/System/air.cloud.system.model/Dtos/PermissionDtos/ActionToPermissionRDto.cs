namespace air.cloud.system.model.Dtos.PermissionDtos
{
    public  class ActionToPermissionRDto
    {
        /// <summary>
        /// 应用程序编号
        /// </summary>
        public string AppId { get; set; }

        /// <summary>
        /// 同步成功数量
        /// </summary>
        public int AsyncSuccessCount { get; set; }

        /// <summary>
        /// 同步失败数量
        /// </summary>
        public int AsyncFailureCount { get; set; }

        /// <summary>
        /// 是否同步成功
        /// </summary>
        /// <returns></returns>
        public bool IsAllSuccess()
        {
            return AsyncFailureCount == 0;
        }

    }
}
