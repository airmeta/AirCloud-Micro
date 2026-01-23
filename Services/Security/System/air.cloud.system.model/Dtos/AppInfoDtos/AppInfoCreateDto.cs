using air.cloud.security.common.Enums;

using Air.Cloud.Core.App;

using Microsoft.AspNetCore.Http;

namespace air.cloud.system.model.Dtos.AppInfoDtos
{
    /// <summary>
    /// <para>zh-cn:应用创建数据传输对象</para>
    /// <para>en-us:App Create Data Transfer Object</para>
    /// </summary>
    public class AppInfoCreateDto
    {
        /// <summary>
        /// <para>zh-cn:编号</para>
        /// <para>en-us:ID</para>
        /// </summary>
        public string Id { get; set; }

        /// <summary>
        /// <para>zh-cn:应用ID</para>
        /// <para>en-us:Application ID</para>   
        /// </summary>
        public string AppId { get; set; }

        /// <summary>
        /// <para>zh-cn:应用名称</para>
        /// <para>en-us:Application Name</para>
        /// </summary>
        public string AppName { get; set; }

        /// <summary>
        /// <para>zh-cn:应用重定向地址</para>
        /// <para>en-us:Application Redirect URL</para>
        /// </summary>
        public string AppRedirectUrl { get; set; }

        /// <summary>
        /// <para>zh-cn:加密方式</para>
        /// <para>en-us:Encryption Type</para>
        /// </summary>
        public AppEntryptTypeEnum AppEncryptType { get; set;  } = AppEntryptTypeEnum.RSA;
        /// <summary>
        /// <para>zh-cn:私钥</para>
        /// <para>en-us:Private Key</para>
        /// </summary>
        public string? PrivateKey { get; set; }
        /// <summary>
        /// <para>zh-cn:应用私钥</para>
        /// <para>en-us:Application Private Key</para>
        /// </summary>
        public string? AppPrivateKey { get; set; }
        /// <summary>
        /// <para>zh-cn:应用描述</para>
        /// <para>en-us:Application Description</para>
        /// </summary>
        public string Description { get; set; }

        /// <summary>
        /// <para>zh-cn:是否为公共应用</para>
        /// <para>en-us:Is Common Application</para>
        /// </summary>
        public IsOrNotEnum IsCommonApp { get; set;  } = IsOrNotEnum.否;

        /// <summary>
        /// <para>zh-cn:应用Logo</para>
        /// <para>en-us:Application Logo</para>
        /// </summary>
        public string Logo { get; set; }

        /// <summary>
        /// <para>zh-cn:是否启用多因素认证</para>
        /// <para>en-us:Enable Multi-Factor Authentication</para>
        /// </summary>
        public IsOrNotEnum EnableMFA { get; set; }

    }

    /// <summary>
    /// <para>zh-cn:应用创建数据传输对象</para>
    /// <para>en-us:App Create Data Transfer Object</para>
    /// </summary>
    public class AppInfoResultDto
    {
        /// <summary>
        /// <para>zh-cn:编号</para>
        /// <para>en-us:ID</para>
        /// </summary>
        public string Id { get; set; }

        /// <summary>
        /// <para>zh-cn:应用ID</para>
        /// <para>en-us:Application ID</para>   
        /// </summary>
        public string AppId { get; set; }

        /// <summary>
        /// <para>zh-cn:应用名称</para>
        /// <para>en-us:Application Name</para>
        /// </summary>
        public string AppName { get; set; }

        /// <summary>
        /// <para>zh-cn:应用重定向地址</para>
        /// <para>en-us:Application Redirect URL</para>
        /// </summary>
        public string AppRedirectUrl { get; set; }

        /// <summary>
        /// <para>zh-cn:加密方式</para>
        /// <para>en-us:Encryption Type</para>
        /// </summary>
        public AppEntryptTypeEnum AppEncryptType { get; set; } = AppEntryptTypeEnum.RSA;
        /// <summary>
        /// <para>zh-cn:公钥</para>
        /// <para>en-us:Public Key</para>
        /// </summary>
        public string? PublicKey { get; set; }
        /// <summary>
        /// <para>zh-cn:应用私钥</para>
        /// <para>en-us:Application Private Key</para>
        /// </summary>
        public string? AppPrivateKey { get; set; }
        /// <summary>
        /// <para>zh-cn:应用描述</para>
        /// <para>en-us:Application Description</para>
        /// </summary>
        public string Description { get; set; }

        /// <summary>
        /// <para>zh-cn:是否为公共应用</para>
        /// <para>en-us:Is Common Application</para>
        /// </summary>
        public IsOrNotEnum IsCommonApp { get; set; } = IsOrNotEnum.否;

        /// <summary>
        /// <para>zh-cn:应用Logo</para>
        /// <para>en-us:Application Logo</para>
        /// </summary>
        public string? Logo { get; set; }

        /// <summary>
        /// <para>zh-cn:是否启用多因素认证</para>
        /// <para>en-us:Enable Multi-Factor Authentication</para>
        /// </summary>
        public IsOrNotEnum EnableMFA { get; set; }

    }




    /// <summary>
    /// 应用首次创建Dto
    /// </summary>
    public class AppInfoFirstCreateDto :AppInfoCreateDto
    {
        /// <summary>
        /// 默认账户名   系统会根据此账户名创建一个管理员账户 密码为随机密码 并打印到控制台
        /// </summary>
        public string DefaultAccount { get; set; }

        /// <summary>
        /// 统一身份认证平台AppId
        /// </summary>
        public string DefaultAppId { get; set; }


    }
}
