// 后端API基础地址
// 开发环境：使用电脑的局域网IP地址，使手机能够连接
// 注意：如果电脑IP地址变化，需要更新这里的IP地址
export const baseURL = process.env.NODE_ENV === 'development' 
	? 'http://192.168.177.133:8123/api' 
	: 'https://your-api-domain.com/api';

// 答题页面地址
export const getOpenLockAnswer = 'https://your-domain.com/answer/';

export default {
	baseURL,
	getOpenLockAnswer
};

