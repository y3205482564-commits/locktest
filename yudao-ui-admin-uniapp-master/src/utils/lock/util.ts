function compareVersion(v1: string, v2: string) {
  const v1Arr = v1.split('.')
  const v2Arr = v2.split('.')
  const len = Math.max(v1Arr.length, v2Arr.length)

  while (v1Arr.length < len) {
    v1Arr.push('0')
  }
  while (v2Arr.length < len) {
    v2Arr.push('0')
  }

  for (let i = 0; i < len; i++) {
    const num1 = parseInt(v1Arr[i], 10)
    const num2 = parseInt(v2Arr[i], 10)

    if (num1 > num2) {
      return 1
    }
    else if (num1 < num2) {
      return -1
    }
  }

  return 0
}

// 时间戳
function timestampToTime(timestamp: number) {
  if (timestamp == null) {
    return ''
  }
  const date = new Date(timestamp * 1000) // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
  const Y = `${date.getFullYear()}-`
  const M = `${(date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1)}-`
  const D = `${date.getDate()} `
  const h = `${date.getHours()}:`
  const m = (date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes())
  const s = `:${date.getSeconds()}`
  return Y + M + D + h + m
}

// ArrayBuffer转16进度字符串示例
function ab2hex(buffer: ArrayBuffer) {
  const hexArr = Array.prototype.map.call(
    new Uint8Array(buffer),
    (bit: number) => (`00${bit.toString(16)}`).slice(-2),
  )
  return hexArr.join('')
}

function formatMac(mac: string) {
  if (!mac)
    return ''
  let formatMac = ''
  for (let i = 0; i < mac.length / 2; i++) {
    formatMac += mac.substring(2 * i, 2 * (i + 1))
    if (i != mac.length / 2 - 1) {
      formatMac += ':'
    }
  }
  return formatMac.toUpperCase()
}

function bytesToArrayBuffer(bytes: number[]) {
  const buffer = new ArrayBuffer(bytes.length)
  const dataView = new DataView(buffer)
  for (let i = 0; i < bytes.length; i++) {
    dataView.setUint8(i, bytes[i])
  }
  return buffer
}

const ipReg = /^((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))$/

const portReg = /^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/

function intToIp(int: number) {
  return `${int >>> 24}.${int >> 16 & 0xFF}.${int >> 8 & 0xFF}.${int & 0xFF}`
}

/**
 * 判断字符串是否是链接
 * @param str
 */
function isLink(str: string) {
  const pattern = /(https?|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/
  return pattern.test(str)
}

function intStrToHexStr(str: string, base: number) {
  let val = parseInt(str).toString(16)
  while (val.length < base) {
    val = `0${val}`
  }
  return val
}

function ipToHexStr(ip: string) {
  const val = ip.split('.')
  return intStrToHexStr(val[0], 2) + intStrToHexStr(val[1], 2) + intStrToHexStr(val[2], 2) + intStrToHexStr(val[3],
    2)
}

export default {
  compareVersion,
  timestampToTime,
  ab2hex,
  formatMac,
  bytesToArrayBuffer,
  ipReg,
  portReg,
  intToIp,
  intStrToHexStr,
  ipToHexStr,
  isLink,
}

