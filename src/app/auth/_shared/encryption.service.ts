import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { ENCRYPTION_KEY } from 'src/app/_shared/constants/constants';

@Injectable()
export class EncryptionService {
  private encryptionKey;

  constructor() {
    this.encryptionKey = ENCRYPTION_KEY;
  }

  //The set method is use for encrypt the value.
  set(value){
    var key = CryptoJS.enc.Utf8.parse(this.encryptionKey);
    var iv = CryptoJS.enc.Utf8.parse(this.encryptionKey);
    var encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(value.toString()), key,
    {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });

    return encrypted.toString();
  }

  //The get method is use for decrypt the value.
  get(value){
    var key = CryptoJS.enc.Utf8.parse(this.encryptionKey);
    var iv = CryptoJS.enc.Utf8.parse(this.encryptionKey);
    var decrypted = CryptoJS.AES.decrypt(value, key, {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });

    return decrypted.toString(CryptoJS.enc.Utf8);
  }
}
