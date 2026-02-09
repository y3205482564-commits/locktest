import CryptoJS from "crypto-js";
import { Buffer } from 'buffer';
/**
 * @word 要加密的内容
 * @keyWord String  服务器随机返回的关键字
 *  */
export function aesEcbEncrypt(word, keyWord = "XwKsGlMc8PMEhR1B") {
	var key = CryptoJS.enc.Utf8.parse(keyWord);
	var srcs = CryptoJS.enc.Utf8.parse(word);
	var encrypted = CryptoJS.AES.encrypt(srcs, key, {
		mode: CryptoJS.mode.ECB,
		padding: CryptoJS.pad.Pkcs7,
	});
	return encrypted.toString();
}

export function aesEncrypt(word, type = "CBC", keyWord = "XwKsGlMc8PMEhR1B") {
	let mode;
	switch (type) {
		case "CBC":
			mode = CryptoJS.mode.CBC;
			break;
		case "CFB":
			mode = CryptoJS.mode.CFB;
			break;
		default:
			break;
	}
	var key = CryptoJS.enc.Utf8.parse(keyWord);
	const iv = key;
	var encrypted = CryptoJS.AES.encrypt(word, key, {
		iv,
		mode: mode,
		padding: CryptoJS.pad.Pkcs7,
	});
	return encrypted.toString();
}

export function aesDecrypt(text, type = "CBC", keyWord = "XwKsGlMc8PMEhR1B") {
	let mode;
	switch (type) {
		case "CBC":
			mode = CryptoJS.mode.CBC;
			break;
		case "CFB":
			mode = CryptoJS.mode.CFB;
			break;
		default:
			break;
	}
	var key = CryptoJS.enc.Utf8.parse(keyWord);
	const iv = key;
	var decrypted = CryptoJS.AES.decrypt(text, key, {
		iv,
		mode: mode,
		padding: CryptoJS.pad.Pkcs7,
	});
	return decrypted.toString(CryptoJS.enc.Utf8);
}
export function encrypts(sSrc, sKey) {
	try {
		const srcHex = CryptoJS.enc.Hex.parse(Buffer.from(sSrc).toString('hex'));
		const keyHex = CryptoJS.enc.Hex.parse(Buffer.from(sKey).toString('hex'));
		// 使用 AES 加密，ECB 模式，NoPadding 填充
		const encrypted = CryptoJS.AES.encrypt(srcHex, keyHex, {
		  mode: CryptoJS.mode.ECB,
		  padding: CryptoJS.pad.NoPadding
		});
		// 返回加密后的字节数组
		return Buffer.from(encrypted.ciphertext.toString(), 'hex');
	} catch (ex) {
		return null;
	}
}

export function decrypts(sSrc, sKey) {
	console.log('sSrc', sSrc)
	console.log('sKey', sKey)
  try {
		const srcBase64 = Buffer.from(Buffer.from(sSrc).toString('hex'), 'hex').toString('base64');
		// 使用 AES 解密，ECB 模式，NoPadding 填充
		const keyHex = CryptoJS.enc.Hex.parse(Buffer.from(sKey).toString('hex'));
		var decrypted = CryptoJS.AES.decrypt(srcBase64, keyHex, {
			mode: CryptoJS.mode.ECB,
			padding: CryptoJS.pad.NoPadding,
	   });
    // 返回解密后的字节数组
    return Buffer.from(decrypted.toString(CryptoJS.enc.Hex), 'hex');
  } catch (ex) {
    return null;
  }
}

