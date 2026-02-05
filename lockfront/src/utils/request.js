/**
 * HTTP请求封装 - Mock版本
 * 由于暂时不考虑后端，返回模拟数据
 */

// Mock数据：模拟设备信息
const mockDeviceInfo = {
	id: 'mock_lock_001',
	lockNum: '智能锁-001',
	mac: 'AA:BB:CC:DD:EE:FF',
	blueType: '0', // 0: 标准智能锁, 2: 红色智能锁, 3: 带关锁功能的智能锁
	password: '1,2,3,4,5,6', // 开锁密码（逗号分隔）
	secretKey: '1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16', // 加密密钥（逗号分隔）
	isInstructClosed: '0', // 是否有关锁功能: '0' 无, '1' 有
	useCount: 100, // 使用次数
	lastUser: '测试用户', // 上次使用人
	lastUseTime: '2024-01-01 12:00:00', // 上次使用时间
	answerQuestion: 0, // 是否需要答题: 0 否, 1 是
	operType: '0', // 操作类型: '0' 正常, '1' 需要多人确认
	records: [] // 未确认人员列表
};

/**
 * HTTP请求函数
 * @param {string} method - 请求方法: 'get', 'post'
 * @param {string} url - 请求URL
 * @param {object} data - 请求数据
 * @returns {Promise} 返回Promise对象
 */
export default function request(method, url, data = {}) {
	return new Promise((resolve, reject) => {
		// 模拟网络延迟
		setTimeout(() => {
			// 根据URL路径返回不同的mock数据
			if (url.includes('getBluetoothBaseInfo')) {
				// 获取设备信息
				const id = url.split('id=')[1] || 'mock_lock_001';
				resolve({
					status: 200,
					data: {
						...mockDeviceInfo,
						id: id,
						// 可以根据id返回不同的模拟数据
						blueType: id.includes('red') ? '2' : (id.includes('close') ? '3' : '0'),
						isInstructClosed: id.includes('close') ? '1' : '0'
					},
					operType: '0',
					records: [],
					message: '获取成功'
				});
			} else if (url.includes('addUseRecords')) {
				// 添加使用记录
				resolve({
					status: 200,
					data: {
						success: true,
						message: '记录成功'
					},
					message: '上传成功'
				});
			} else if (url.includes('updateElectQuantity')) {
				// 更新电量
				resolve({
					status: 200,
					data: {
						success: true,
						message: '电量更新成功'
					},
					message: '上传成功'
				});
			} else {
				// 默认返回成功
				resolve({
					status: 200,
					data: {
						success: true
					},
					message: '操作成功'
				});
			}
		}, 300); // 模拟300ms延迟
	});
}

