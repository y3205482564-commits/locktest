import config from '@/config/index.js';

const baseURL = config.baseURL || 'http://localhost:8123/api';

/**
 * HTTP请求封装
 * @param {String} method 请求方法
 * @param {String} url 请求地址
 * @param {Object} data 请求数据
 * @param {Object} options 其他选项
 */
function request(method, url, data = {}, options = {}) {
	return new Promise((resolve, reject) => {
		// 显示加载提示
		if (options.showLoading !== false) {
			uni.showLoading({
				title: options.loadingText || '加载中...',
				mask: true
			});
		}

		// 获取token
		const token = uni.getStorageSync('token') || '';

		// 发起请求
		uni.request({
			url: baseURL + '/' + url,
			method: method.toUpperCase(),
			data: data,
			header: {
				'Content-Type': 'application/json',
				'Authorization': token ? `Bearer ${token}` : '',
				...options.header
			},
			timeout: options.timeout || 10000,
			success: (res) => {
				if (options.showLoading !== false) {
					uni.hideLoading();
				}

				// HTTP状态码判断
				if (res.statusCode === 200) {
					// 后端返回格式为 Result<T> {code, message, data}
					const responseData = res.data || res;
					// 如果后端返回的是 Result 格式，提取 data 字段，同时保留 code 和 message
					if (responseData && typeof responseData === 'object' && 'code' in responseData) {
						if (responseData.code === 200) {
							// 成功时，将 data 字段提升到顶层，同时保留其他字段
							const result = {
								...responseData,
								data: responseData.data,
								status: responseData.code
							};
							resolve(result);
						} else {
							// 业务错误
							const errorMsg = responseData.message || '操作失败';
							if (options.showError !== false) {
								uni.showToast({
									title: errorMsg,
									icon: 'none',
									duration: 2000
								});
							}
							reject(responseData);
						}
					} else {
						// 兼容非 Result 格式的响应
						resolve(responseData);
					}
				} else {
					// 处理错误
					const errorMsg = res.data?.message || `请求失败: ${res.statusCode}`;
					if (options.showError !== false) {
						uni.showToast({
							title: errorMsg,
							icon: 'none',
							duration: 2000
						});
					}
					reject(res);
				}
			},
			fail: (err) => {
				if (options.showLoading !== false) {
					uni.hideLoading();
				}

				// 网络错误处理
				const errorMsg = err.errMsg || '网络请求失败';
				if (options.showError !== false) {
					uni.showToast({
						title: errorMsg,
						icon: 'none',
						duration: 2000
					});
				}
				reject(err);
			}
		});
	});
}

export default request;

