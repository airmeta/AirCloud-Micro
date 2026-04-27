export interface LoginResult {
    account: accountInfo;
    app: appInfo;

}
export interface accountInfo{
    //登录状态 0-登录成功 
    accountStatus:number;
    //是否启用多因素认证 0-否 1-是
    enableMFA:boolean;
    //超时时间
    expiredTime:string;
    //负载
    payload:string;
    //票据信息
    ticket:string;
}
export interface appInfo{
    //应用名称
    appName:string;
    //应用ID
    appId:string;
    //客户端配置信息
    client:clientConfig;
}

export interface clientConfig{
    //票据信息
    ticket:string;
    //超时时间(秒)
    expiredSeconds:number;
    //应用加密类型
    appEntryptType:number;
    //私钥
    privateKey:string;
    //是否启用多因素认证 0-否 1-是
    enableMFA:boolean;
}


export interface appStatusDto {
    //是否已有应用
    hasApp: boolean;
    //唯一应用标识
    appId: string;
    //应用名称
    appName: string;
    //客户端配置
    client: clientConfig;
    //应用设置
    Settings: Record<string, string>;
        //登录页路径
    loginPath:string
}

export interface appSettings {
    appName: string;
    appId: string;
    loginPath:string
}