/**
 * 从URL中获取查询参数
 * @param url URL字符串
 * @param name 参数名
 * @returns 参数值
 */
export function getQueryString(url: string, name: string) {
  const reg = new RegExp(`(^|&|\\?)${name}=([^&]*)(&|$)`, 'i')
  const r = url.match(reg)
  if (r != null) {
    return decodeURIComponent(r[2])
  }
  return null
}

/**
 * 从URL中获取所有参数
 * @param url URL字符串
 * @returns 参数对象
 */
export function getParamsFromUrl(url: string) {
  const params: Record<string, string> = {}
  if (url.indexOf('?') !== -1) {
    const str = url.substr(url.indexOf('?') + 1)
    const strs = str.split('&')
    for (let i = 0; i < strs.length; i++) {
      const keyValue = strs[i].split('=')
      if (keyValue.length === 2) {
        params[keyValue[0]] = decodeURIComponent(keyValue[1])
      }
    }
  }
  return params
}

