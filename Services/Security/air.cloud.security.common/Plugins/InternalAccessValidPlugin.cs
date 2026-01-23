using Air.Cloud.Core;
using Air.Cloud.Core.Modules.AppPrint;
using Air.Cloud.Core.Plugins.InternalAccess;
using Air.Cloud.Core.Plugins.Security.RSA;

namespace air.cloud.security.common.Plugins
{
    public  class InternalAccessValidPlugin : IInternalAccessValidPlugin
    {
        public Tuple<string, string> CreateInternalAccessToken()
        {
            return new Tuple<string, string>("Launcher", RsaEncryption.Encrypt(AppRealization.PID.Get(), RsaKeyConst.PUBLIC_KEY, RsaKeyConst.PRIVATE_KEY));
        }

        public bool ValidInternalAccessToken(IDictionary<string, string> Headers)
        {
            if (Headers.ContainsKey("Launcher"))
            {
                try
                {
                    string Value = Headers["Launcher"];
                    if (string.IsNullOrEmpty(Value))
                        return false;
                    string DecryptValue = RsaEncryption.Decrypt(Value, RsaKeyConst.PUBLIC_KEY, RsaKeyConst.PRIVATE_KEY);
                    if (string.IsNullOrEmpty(DecryptValue))
                        return false;
                    return true;
                }
                catch (Exception)
                {
                    AppRealization.Output.Print(new AppPrintInformation()
                    {
                        Title = "The InternalAccessValidPlugin Log",
                        Content = "解密失败",
                        Level = AppPrintLevel.Error
                    });
                    return false;
                }
            }
            return false;
        }
    }
}
