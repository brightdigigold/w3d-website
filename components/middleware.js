import CryptoJS from 'crypto-js';
import {Decimal} from 'decimal.js';


export function AesEncrypt(data) {
    const key = 'B?E(H+MbQeThWmZq4t7w!z$C&F)J@NcR'
    const iv = 'AEF$#DQER@#R@#f3'
    let cipher = CryptoJS.AES.encrypt(JSON.stringify(data), CryptoJS.enc.Utf8.parse(key), {
        iv: CryptoJS.enc.Utf8.parse(iv), // parse the IV 
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC
    })

    // e.g. B6AeMHPHkEe7/KHsZ6TW/Q==
    let b64 = cipher.toString();
    let e64 = CryptoJS.enc.Base64.parse(b64);
    let eHex = e64.toString(CryptoJS.enc.Hex);
    return eHex;
}

export function AesDecrypt(data) {
    const key = 'B?E(H+MbQeThWmZq4t7w!z$C&F)J@NcR'
    const iv = 'AEF$#DQER@#R@#f3'
    var reb64 = CryptoJS.enc.Hex.parse(data)
    var bytes = reb64?.toString(CryptoJS.enc.Base64);
    let cipher = CryptoJS.AES.decrypt(bytes, CryptoJS.enc.Utf8.parse(key), {
        iv: CryptoJS.enc.Utf8.parse(iv),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    // 

    return cipher.toString(CryptoJS.enc.Utf8);
}

export function fixDecimalDigit(number, digit) {
    // if(number != '' || number >= 0){
    //     const fixedNumber = new Decimal(parseFloat(number)).toDP(digit); // Limit to 4 decimal places
    //     console.info('fixedNumber',fixedNumber);
    //     return fixedNumber.toNumber();
    //     // var multiplier = Math.pow(10, digit);
    //     // var fixedNumber = (Math.floor(number * multiplier) / multiplier);
    //     // return fixedNumber;
    //     // return fixedNumber;
    // }
     if(number && (number != '' || number >= 0)){
      // console.log('number',number);
        return Number(number).toFixedNoRounding(digit);
     }else{
        return Number(number);
     }
    // return number;
  }

  export const toFixedNoRounding = function(n) {
    const reg = new RegExp("^-?\\d+(?:\\.\\d{0," + n + "})?", "g");
    // console.log('length',this.toString().match(reg));
    const a = this.toString().match(reg)?this.toString().match(reg)[0]:this;
    const dot = a.indexOf(".");
    if (dot === -1) {
      return a + "." + "0".repeat(n);
    }
    const b = n - (a.length - dot) + 1;
    return b > 0 ? a + "0".repeat(b) : a;
  };
  
  // Attach it to the Number prototype
  Number.prototype.toFixedNoRounding = toFixedNoRounding;








