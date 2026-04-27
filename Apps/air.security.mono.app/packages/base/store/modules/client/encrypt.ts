import { clientConfig } from "@root/base/api/modules/appLoginServices/dtos/loginResult";
import { getClientConfig } from "@root/base/store/modules/client/client";
import JSEncrypt from 'jsencrypt';
import { sm2 } from 'sm-crypto-v2';
export class EncryptUtil {
    static encryptData(data: string, publicKey: string): string | false {
        try {
            const client_config = getClientConfig() as clientConfig;
              console.warn("客户端配置",client_config);
            if (!client_config) {
                console.warn("无法获取客户端配置，无法加密数据",client_config);
                return "";
            }
            if (client_config.appEntryptType === 0) {
                // RSA加密
                const encryptor = new JSEncrypt();
                encryptor.setPublicKey(publicKey);
                console.log("使用RSA加密",data,publicKey);
                return encryptor.encrypt(data) as string;
            } else if (client_config.appEntryptType === 1) {
                const cipherMode = 1; // 1 - C1C3C2 模式
                // 加密
                const encryptedData = sm2.doEncrypt(data, publicKey, cipherMode);
                //转base64
                return btoa(encryptedData);
            }
            // 默认不加密
            return "";
        } catch (e) {
            console.error("加密失败：", e);
            return false;

        }

    }
}