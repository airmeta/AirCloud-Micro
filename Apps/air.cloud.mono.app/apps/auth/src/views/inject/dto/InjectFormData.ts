export interface InjectFormData {
  //应用名称
  appName: string;
  //默认管理员账号
  defaultAccount: string;
  //私钥
  privateKey: string;
  //加密类型
  appEncryptType: number;
  //应用ID
  appId?: string;
  //默认应用ID 本系统中配置的appId
  defaultAppId?: string;
  //应用重定向地址
  appRedirectUrl?: string;
}