using Air.Cloud.Core.Standard.DynamicServer;

namespace air.cloud.system.service.Services.PublicServices
{
    public interface IPublicService:IDynamicService
    {
        /// <summary>
        /// 初始化App状态信息
        /// </summary>
        /// <returns></returns>
        public Task<object> InitAppStatusAsync(string AppId = null);
        

    }
}
