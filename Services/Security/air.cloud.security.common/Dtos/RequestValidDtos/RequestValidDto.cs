using Air.Cloud.Core.Standard.SkyMirror.Model;

namespace air.cloud.security.common.Dtos.RequestValidDtos
{
    public  class RequestValidDto
    {
        /// <summary>
        /// <para>zh-cn:请求地址</para>
        /// </summary>
        public string Path { get; set; }
        /// <summary>
        /// <para>zh-cn:请求头</para>
        /// </summary>
        public IDictionary<string, string> Headers { get; set; }

        /// <summary>
        /// <para>zh-cn:终结点信息</para>
        /// </summary>
        public EndpointData EndpointData { get; set; }

    }
}
