// Converted from C# entity to TypeScript DTO
// Note: nullable C# strings are represented as `string | null`.

/** 是否（0/1） */
export type IsOrNot = 0 | 1;

/** 应用加密类型枚举，保持与后端 C# 枚举顺序一致 */
export enum AppEncryptTypeEnum {
    RSA = 0,
    SM2 = 1,
}

export interface AppQuery {
  /** 搜索关键字 */
  info?: string;
}

export interface AppVO {
 /** 应用ID */
    appId: string;

    /** 应用名称 */
    appName: string;

    /** 应用重定向地址 */
    appRedirectUrl?: string | null;

    /** 图标（CLOB） */
    logo?: string | null;

    /** 是否默认应用（0/1） */
    isDefault?: IsOrNot;

    /** 应用的加密类型 */
    appEncryptType?: AppEncryptTypeEnum;

    /** 我方的公钥(传给应用,应用做加密) */
    publicKey?: string;

    /** 对方私钥(解密对方的数据) */
    appPrivateKey?: string | null;

    /** 是否开启多因素认证（0/1） */
    enableMfa?: IsOrNot;

    /** 描述 */
    description?: string | null;

    /** 是否为公共应用（0/1） */
    isCommonApp?: IsOrNot;
    
    id: string; // 用于编辑时的唯一标识

}

export interface AppForm {
    // 前端表单模型：使用小驼峰命名并将 0/1 类型映射为 boolean 以便绑定表单控件
    appId: string;
    appName: string;
    appRedirectUrl?: string | null;
    logo?: string | null;
    isDefault?: boolean; // true 表示 1/是
    appEncryptType?: AppEncryptTypeEnum;
    publicKey?: string;
    appPrivateKey?: string | null;
    enableMfa?: boolean;
    description?: string | null;
    isCommonApp?: boolean;
    id: string; // 用于编辑时的唯一标识
}





// 辅助转换：后端 AppInformation -> 前端 AppForm
export function toAppForm(info: AppVO): AppForm {
    return {
        appId: info.appId,
        appName: info.appName,
        appRedirectUrl: info.appRedirectUrl ?? null,
        logo: info.logo ?? null,
        isDefault: info.isDefault === 1,
        appEncryptType: info.appEncryptType as AppEncryptTypeEnum | undefined,
        publicKey: info.publicKey ?? undefined,
        appPrivateKey: info.appPrivateKey ?? null,
        enableMfa: info.enableMfa === 1,
        description: info.description ?? null,
        isCommonApp: info.isCommonApp === 1,
        id: info.id,
    };
}

// 辅助转换：前端 AppForm -> 后端 AppInformation（部分字段可能需要后端填充）
export function fromAppForm(form: AppForm): AppVO {
    return {
        appId: form.appId,
        appName: form.appName,
        appRedirectUrl: form.appRedirectUrl ?? null,
        logo: form.logo ?? null,
        isDefault: form.isDefault ? 1 : 0,
        appEncryptType: form.appEncryptType ?? AppEncryptTypeEnum.RSA,
        publicKey: form.publicKey ?? '',
        appPrivateKey: form.appPrivateKey ?? null,
        enableMfa: form.enableMfa ? 1 : 0,
        description: form.description ?? null,
        isCommonApp: form.isCommonApp ? 1 : 0,
        id: form.id,
    };
}




