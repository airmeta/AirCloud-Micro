namespace air.cloud.system.service.Services.SecurityServices
{
    public interface ISecurityService
    {
        //此接口应该包含OAUTH2.0相关的方法定义 比如: 获取授权码、交换令牌、刷新令牌、退出登录、权限验证等

        public string GetAuthorizationCode(string clientId, string redirectUri, string scope, string state);

        public string ExchangeToken(string authorizationCode, string clientId, string clientSecret, string redirectUri);

        public string RefreshToken(string refreshToken, string clientId, string clientSecret);      

        public void RevokeToken(string token, string clientId, string clientSecret);

        public bool ValidateToken(string token, string requiredScope);

        public string GetUserInfo(string token);

    }
}
