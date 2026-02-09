/**
 * 从URL中获取查询参数
 * @param {String} url URL字符串
 * @param {String} name 参数名
 * @returns {String} 参数值
 */
export function getQueryString(url, name) {
	const reg = new RegExp('(^|&|\\?)' + name + '=([^&]*)(&|$)', 'i');
	const r = url.match(reg);
	if (r != null) {
		return decodeURIComponent(r[2]);
	}
	return null;
}

/**
 * 从URL中获取所有参数
 * @param {String} url URL字符串
 * @returns {Object} 参数对象
 */
export function getParamsFromUrl(url) {
	const params = {};
	if (url.indexOf('?') !== -1) {
		const str = url.substr(url.indexOf('?') + 1);
		const strs = str.split('&');
		for (let i = 0; i < strs.length; i++) {
			const keyValue = strs[i].split('=');
			if (keyValue.length === 2) {
				params[keyValue[0]] = decodeURIComponent(keyValue[1]);
			}
		}
	}
	return params;
}

