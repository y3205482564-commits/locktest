import CryptoJS from 'crypto-js'
import { Buffer } from 'buffer'

/**
 * @word 要加密的内容
 * @keyWord String  服务器随机返回的关键字
 */
export function aesEcbEncrypt(word: string, keyWord = 'XwKsGlMc8PMEhR1B') {
  const key = CryptoJS.enc.Utf8.parse(keyWord)
  const srcs = CryptoJS.enc.Utf8.parse(word)
  const encrypted = CryptoJS.AES.encrypt(srcs, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  })
  return encrypted.toString()
}

export function aesEncrypt(word: string, type: 'CBC' | 'CFB' = 'CBC', keyWord = 'XwKsGlMc8PMEhR1B') {
  let mode: any
  switch (type) {
    case 'CBC':
      mode = CryptoJS.mode.CBC
      break
    case 'CFB':
      mode = CryptoJS.mode.CFB
      break
    default:
      break
  }
  const key = CryptoJS.enc.Utf8.parse(keyWord)
  const iv = key
  const encrypted = CryptoJS.AES.encrypt(word, key, {
    iv,
    mode,
    padding: CryptoJS.pad.Pkcs7,
  })
  return encrypted.toString()
}

export function aesDecrypt(text: string, type: 'CBC' | 'CFB' = 'CBC', keyWord = 'XwKsGlMc8PMEhR1B') {
  let mode: any
  switch (type) {
    case 'CBC':
      mode = CryptoJS.mode.CBC
      break
    case 'CFB':
      mode = CryptoJS.mode.CFB
      break
    default:
      break
  }
  const key = CryptoJS.enc.Utf8.parse(keyWord)
  const iv = key
  const decrypted = CryptoJS.AES.decrypt(text, key, {
    iv,
    mode,
    padding: CryptoJS.pad.Pkcs7,
  })
  return decrypted.toString(CryptoJS.enc.Utf8)
}

export function encrypts(sSrc: number[], sKey: number[]) {
  try {
    const srcHex = CryptoJS.enc.Hex.parse(Buffer.from(sSrc).toString('hex'))
    const keyHex = CryptoJS.enc.Hex.parse(Buffer.from(sKey).toString('hex'))
    // 使用 AES 加密，ECB 模式，NoPadding 填充
    const encrypted = CryptoJS.AES.encrypt(srcHex, keyHex, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.NoPadding,
    })
    // 返回加密后的字节数组
    return Buffer.from(encrypted.ciphertext.toString(), 'hex')
  }
  catch (ex) {
    return null
  }
}

export function decrypts(sSrc: ArrayBuffer, sKey: number[]) {
  console.log('sSrc', sSrc)
  console.log('sKey', sKey)
  try {
    const srcBase64 = Buffer.from(Buffer.from(sSrc).toString('hex'), 'hex').toString('base64')
    // 使用 AES 解密，ECB 模式，NoPadding 填充
    const keyHex = CryptoJS.enc.Hex.parse(Buffer.from(sKey).toString('hex'))
    const decrypted = CryptoJS.AES.decrypt(srcBase64, keyHex, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.NoPadding,
    })
    // 返回解密后的字节数组
    return Buffer.from(decrypted.toString(CryptoJS.enc.Hex), 'hex')
  }
  catch (ex) {
    return null
  }
}

