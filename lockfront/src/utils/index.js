/**
 * 工具函数集合
 */

/**
 * 从URL中获取指定查询参数的值
 * @param {string} url - 完整的URL字符串
 * @param {string} name - 参数名称
 * @returns {string|null} 参数值，如果不存在则返回null
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
 * 从URL中解析所有查询参数为对象
 * @param {string} url - 完整的URL字符串
 * @returns {object} 包含所有查询参数的对象
 */
export function getParamsFromUrl(url) {
	const params = {};
	// 提取查询字符串部分
	const queryString = url.split('?')[1];
	if (!queryString) {
		return params;
	}
	
	// 分割参数
	const pairs = queryString.split('&');
	for (let i = 0; i < pairs.length; i++) {
		const pair = pairs[i].split('=');
		if (pair.length === 2) {
			const key = decodeURIComponent(pair[0]);
			const value = decodeURIComponent(pair[1]);
			params[key] = value;
		}
	}
	
	return params;
}

