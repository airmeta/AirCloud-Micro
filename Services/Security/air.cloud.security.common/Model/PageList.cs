namespace air.cloud.security.common.Model
{
    public  class PageList<T> where T : class
    {
        /// <summary>
        /// 列表数据
        /// </summary>
        public IList<T> List { get; set; }    

        /// <summary>
        /// 数量
        /// </summary>
        public int Count { get; set; }
    }
}
