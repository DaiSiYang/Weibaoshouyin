import CryptoJS from 'crypto-js';


export const aesECBDecrypt = (encryptedText: string, key: string): string => {
    try {

        let keyBytes = CryptoJS.enc.Utf8.parse(key);

        // 如果密钥长度不足，进行填充
        if (keyBytes.sigBytes < 16) {
            const padding = 16 - keyBytes.sigBytes;
            const paddedKey = key + '\0'.repeat(padding);
            keyBytes = CryptoJS.enc.Utf8.parse(paddedKey);
        }

        const decrypted = CryptoJS.AES.decrypt(encryptedText, keyBytes, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });

        const result = decrypted.toString(CryptoJS.enc.Utf8);

        // 检查解密结果是否有效
        if (!result || result.length === 0) {
            console.warn('解密结果为空，可能是密钥不正确');
        }

        return result;
    } catch (error) {
        console.error('解密失败:', error);
        throw error;
    }
};

export const aesECBEncrypt = (text: string, key: string): string => {

    let keyBytes = CryptoJS.enc.Utf8.parse(key);

    // 如果密钥长度不足，进行填充
    if (keyBytes.sigBytes < 16) {
        const padding = 16 - keyBytes.sigBytes;
        const paddedKey = key + '\0'.repeat(padding);
        keyBytes = CryptoJS.enc.Utf8.parse(paddedKey);
    }

    const encrypted = CryptoJS.AES.encrypt(text, keyBytes, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });

    return encrypted.toString();
};