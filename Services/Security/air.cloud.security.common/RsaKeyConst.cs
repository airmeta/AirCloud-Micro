using Air.Cloud.Core.App;

namespace air.cloud.security.common
{
    public class RsaKeyConst
    {
        /// <summary>
        /// 私钥
        /// </summary>
        public static string PRIVATE_KEY => AppCore.Configuration["AppSettings:PrivateKey"];
        /// <summary>
        /// 公钥
        /// </summary>
        public static string PUBLIC_KEY => AppCore.Configuration["AppSettings:PublicKey"];
    }
}
