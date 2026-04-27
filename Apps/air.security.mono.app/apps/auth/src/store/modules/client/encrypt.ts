import { clientConfig } from "@/store/modules/login/appStatusDto";
import { getClientConfig } from "@/store/modules/client/client";
import JSEncrypt from 'jsencrypt';
import { sm2 } from 'sm-crypto-v2';
export class EncryptUtil {
    static encryptData(data: string, publicKey: string): string | false {
        const client_config = getClientConfig() as clientConfig;
        if (!client_config) {
            return "";
        }
        if (client_config.appEntryptType === 0) {
            // RSA加密
            const encryptor = new JSEncrypt();
            encryptor.setPublicKey(publicKey);
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
    }
}