const CryptoJs = require("crypto-js");

export class EncryptDecrypt {

  Encrypt(text: string) {
    return CryptoJs.MD5(text).toString();
  }
}

