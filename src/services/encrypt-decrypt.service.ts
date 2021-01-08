const CryptoJs = require("crypto-js");

export class EncryptDecrypt {

  // realiza el encriptado a MD5 de un texto y lo de vuelve.
  Encrypt(text: string) {
    return CryptoJs.MD5(text).toString();
  }
}

