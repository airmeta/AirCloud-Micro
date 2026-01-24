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

export interface clientConfig {
    //是否启用多因素认证
    enableMFA: boolean;
    //票据信息
    ticket: string;
    // 超时时间(秒)
    expiredSeconds: number;
    //加密方式
    appEntryptType: number;
    //私钥
    privateKey: string;


}


export interface appSettings {
    appName: string;
    appId: string;
}