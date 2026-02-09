<template>
	<view class="lock_container">
		<view class="lock-content">
			<text>锁具编号:</text>
			<text class="lock-text" :class="isConnect?'text-green':'text-red'">{{lockName}}</text>
			<view class="btn-box">
				<image mode="aspectFit" src="https://aq.sglototo.com/wechat/static/scan_lock.png"></image>
				<view class="img-btn" @click="onScanLock">扫 码</view>
			</view>
		</view>
		<view class="lock-content lock-style">
			<text>连接状态:</text>
			<text class="lock-text" :class="isConnect?'text-green':'text-red'">{{lockStatus}}</text>
			<view class="btn-box">
				<image mode="aspectFit" src="https://aq.sglototo.com/wechat/static/lock_close.png"></image>
				<view class="img-btn" @click="onLockClose">断 开</view>
			</view>
		</view>
		<view class="lock-content lock-style">
			<text>剩余电量:</text>
			<text class="lock-text" :class="isConnect?'text-green':'text-red'">{{lockPower}}</text>
			<view class="btn-box">
				<image mode="aspectFit" src="https://aq.sglototo.com/wechat/static/battery_unknown.png"></image>
				<view class="img-btn" @click="onLockPower">获 取</view>
			</view>
		</view>
		<view class="lock-content lock-style">
			<text>使用次数:</text>
			<text class="lock-text2" :class="isConnect?'text-green':'text-red'">{{useNumber}}</text>
		</view>
		<view class="lock-content lock-style">
			<view style="display: flex;flex-direction: column;">
				<text>上次使用</text>
				<text>人/时间</text>
			</view>
			<text>:</text>
			<text class="lock-text2" :class="isConnect?'text-green':'text-red'">{{lastUse}}</text>
		</view>

		<view class="lock-open">
			<view class="btn open" @click="onLockOpen()">开 锁</view>
			<view v-if="isInstructClosed" class="btn close" @click="onCloseLock()">关 锁</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		getCurrentInstance
	} from "vue";
	import {
		onShow,
		onLoad,
		onUnload
	} from "@dcloudio/uni-app";
	import {
		encrypts,
		decrypts
	} from '@/utils/crypto.js';
	import request from '@/utils/request.js';
	import {
		getOpenLockAnswer
	} from '@/config/index.js';
	import redUtil from '@/utils/util.js';
	import {
		getQueryString,
		getParamsFromUrl
	} from '@/utils/index.js';
	import * as redAes from '@/utils/aes/entry-export_all.js';


	const {
		proxy
	} = getCurrentInstance();

	const user = uni.getStorageSync('user') || { userId: '' };

	const lockName = ref('');
	const lockStatus = ref('');
	const lockPower = ref('');
	const useNumber = ref('');
	const lastUse = ref('');

	///判断蓝牙是否可用
	const isblueScan = ref(false);
	///是否已连接
	const isConnect = ref(false);

	const lockDeviceId = ref('');

	///写入的特征UUID
	const writeCharacteristic = ref('');
	///读取服务特征
	const readCharacteristic = ref('');
	///蓝牙服务ID
	const blueServiceId = ref('');

	///开锁密码
	const passWord = ref(null);
	///key
	const secretKey = ref(null);
	///锁Id
	const lockId = ref('');
	///智能锁类型
	const blueType = ref('');
	///红色智能锁随机数
	const randomVal = ref('');
	const seriesNum = ref('');
	const nonce = ref('');
	const initHeader = "6c696e6b706f7765723836323331";

	///令牌
	const tokenDatas = ref([]);
	///电量
	const power = ref(0);

	const initLockId = ref('');

	///是否有关锁功能
	const isInstructClosed = ref(false);

	const eventChannel = ref(null);

	const toHome = ref(false);

	// 获取MAC地址
	function getMacPath(buffer) {
		const hexArr = Array.prototype.map.call(
			new Uint8Array(buffer),
			function(bit) {
				return ('00' + bit.toString(16)).slice(-2)
			}
		)
		console.log(hexArr);
		let mac;
		if (blueType.value == '0' || blueType.value == '3') {
			mac = hexArr.slice(2, 8);
		} else {
			mac = hexArr.slice(9, 15);
		}
		return mac ? mac.join(':').toUpperCase() : '';
	}

	// ArrayBuffer转16进度字符串示例
	function ab2hex(buffer) {
		const hexArr = Array.prototype.map.call(
			new Uint8Array(buffer),
			function(bit) {
				return ('00' + bit.toString(16)).slice(-2)
			}
		)
		return hexArr;
	}

	///扫码智能锁
	function onScanLock() {
		if (isblueScan.value) {
			// 允许从相机和相册扫码
			if (initLockId.value) {
				getBluetoothBaseInfo(initLockId.value);
			} else {
				uni.scanCode({
					scanType: ['qrCode'],
					success: function(res) {
						console.log('条码内容：' + res.result);
						let codeResult = '';
						if (redUtil.isLink(res.result)) {
							codeResult = JSON.parse(getQueryString(res.result, 'initLockData'));
							console.log('条码内容1：' + codeResult);
						} else {
							codeResult = res.result;
							console.log('条码内容2：' + codeResult);
						}
						getBluetoothBaseInfo(codeResult);
					}
				});
			}
		} else {
			uni.showToast({
				title: '请打开蓝牙或将蓝牙权限设置为允许',
				icon: 'none'
			});
		}
	}
	/**查询蓝牙信息*/
	function getBluetoothBaseInfo(barcode) {
		if (barcode && barcode.split(',')[0] === 'blueLock') {
			const id = barcode.split(',')[1];
			uni.showLoading({
				title: "正在获取智能锁信息..."
			});
			request('post', `lock/bluetoothBase/getBluetoothBaseInfo?id=${id}`).then(response => {
				if (response.data && response.data.answerQuestion && response.data
					.answerQuestion == 1) {
					const path = `${getOpenLockAnswer}${response.data.id}`;
					uni.navigateTo({
						url: `/pages/webview/webview?path=${path}&title=答题开锁`
					})
				} else if (response.operType == '1' && response.records && response.records
					.length > 0) {
					let unConfirmName = '';
					response.records.forEach((unName) => {
						unConfirmName += `【${unName.name}】`;
					});
					const dialogText =
						`当前锁<${barcode.split(',')[2]}>权限为同时开锁,需分配的人员确认,直至到最后一人扫码方可连接智能锁开锁，未确认人员:${unConfirmName}`;
					uni.showModal({
						title: '提示',
						content: dialogText,
						showCancel: false,
						confirmText: '关闭',
						success: function(res) {}
					});
				} else {
					///开始搜索
					startBluetoothDevicesDiscovery(response);
				}

			}).finally(() => {
				// uni.hideLoading();
			})
		} else {
			uni.showToast({
				title: '请扫正确的智能锁二维码',
				icon: 'none'
			});
		}
	}


	///开始搜索蓝牙
	function startBluetoothDevicesDiscovery(response) {
		if (response.data && response.data.mac) {
			uni.showLoading({
				title: "正在搜索蓝牙,请唤醒智能锁..."
			});

			const items = response.data;
			if (items.isInstructClosed && items.isInstructClosed == '1') {
				isInstructClosed.value = true;
			} else {
				isInstructClosed.value = false;
			}
			blueType.value = items.blueType;
			if (blueType.value == '0' || blueType.value == '3') {
				passWord.value = items.password.split(',').map((e) => Number(e));
				console.log(passWord.value, '开锁密码');
				secretKey.value = items.secretKey.split(',').map((e) => Number(e));
				console.log(secretKey.value, '密钥');
			} else if (blueType.value == '2') {
				console.log(items, '红色');
				passWord.value = items.password;
				secretKey.value = items.secretKey;
			}

			lockName.value = items.lockNum;
			lockId.value = items.id;
			useNumber.value = items.useCount || '';
			lastUse.value = `${items.lastUser||''}/${items.lastUseTime||''}`;
			const mac = items.mac;
			uni.startBluetoothDevicesDiscovery({
				success(res) {
					///监听搜索蓝牙设备
					uni.onBluetoothDeviceFound(function(device) {
						console.log(device)
						const macPath = getMacPath(device.devices[
							0].advertisData);
						if (macPath && macPath === mac) {
							lockDeviceId.value = device.devices[0]
								.deviceId
							///停止搜索
							uni.stopBluetoothDevicesDiscovery({
								success(res) {
									console.log('停止搜索', res);
								},
								complete(res) {
									if (blueType.value == '2') {
										lockStatus.value = '连接成功';
										console.log(device.devices[0].advertisData, '红色智能锁');
										var broadcast = redUtil.ab2hex(device.devices[0]
											.advertisData);

										randomVal.value = broadcast.substring(0, 8);

										seriesNum.value = broadcast.substring(8, 12);

										let mic = randomVal.value + "000000000000000000000000";

										let ecbEncryptVal = redAes.bytes_to_hex(redAes.AES_ECB
											.encrypt(
												redAes.hex_to_bytes(mic), redAes.hex_to_bytes(
													secretKey.value)));

										nonce.value = getNonceFromEncryptVal(ecbEncryptVal);

									}
									createBLEConnect();
								}
							})

						}
					})
				},
				complete(res) {
					// uni.hideLoading();
				}
			})
		} else {
			if (response.message && response.message.length > 7) {
				uni.hideLoading();
				uni.showModal({
					title: "提示",
					content: response.message,
					confirmText: "确定",
					showCancel: false
				})
			} else {
				uni.showToast({
					title: `${response.message || '获取设备信息失败'}`,
					icon: 'none'
				});
			}
		}
	}

	///连接设备
	function createBLEConnect() {
		// 如果已有连接，先断开
		if (isConnect.value && lockDeviceId.value) {
			uni.closeBLEConnection({
				deviceId: lockDeviceId.value,
				success() {
					console.log('断开旧连接');
					setTimeout(() => {
						doCreateBLEConnect();
					}, 500);
				},
				fail() {
					// 断开失败也继续尝试连接
					doCreateBLEConnect();
				}
			});
		} else {
			doCreateBLEConnect();
		}
	}
	
	///执行创建蓝牙连接
	function doCreateBLEConnect() {
		uni.showLoading({
			title: "正在连接蓝牙..."
		});
		const timeout = 10000; //10S
		uni.createBLEConnection({
			deviceId: lockDeviceId.value,
			timeout: timeout,
			success(res) {
				isConnect.value = true;
				console.log('连接成功', res);
				getBLEDeviceServices();
			},
			fail(res) {
				console.log('连接失败', res);
				uni.showToast({
					title: '连接失败',
					icon: 'none'
				});
				initValue();
			},
			complete(res) {
				uni.hideLoading();
			}
		})
	}

	///监听低功耗蓝牙连接状态的改变事件
	uni.onBLEConnectionStateChange(function(res) {
		isConnect.value = res.connected;
		if (!isConnect.value) {
			uni.showToast({
				title: '已断开蓝牙',
				icon: 'none'
			});
			initValue();
			closeBlueAdapter();
		}
	})

	///获取蓝牙服务
	function getBLEDeviceServices() {
		uni.getBLEDeviceServices({
			deviceId: lockDeviceId.value,
			success(res) {
				console.log('蓝牙设备服务:', res.services)
				if (res.services && res.services.length > 0) {
					if (blueType.value == '0' || blueType.value == '3') {
						const primaryService = res.services.find(item => item.uuid.includes('0000FEE7') && item
							.isPrimary);
						blueServiceId.value = primaryService.uuid;
						getBLEDeviceCharacteristics(primaryService.uuid);
					} else if (blueType.value == '2') {
						blueServiceId.value = "0000CCD0-0000-1000-8000-00805F9B34FB";
						uni.getBLEDeviceCharacteristics({
							deviceId: lockDeviceId.value,
							serviceId: blueServiceId.value,
							success(res) {
								console.log('服务特征值:', res.characteristics)
								readCharacteristic.value = '0000CCD1-0000-1000-8000-00805F9B34FB';
								writeCharacteristic.value = '0000CCD2-0000-1000-8000-00805F9B34FB';
								readRedLockInfo('power');
							},
							fail(res) {
								console.log('获取特征值失败:', res);
							}
						});
					}
				} else {
					getBLEDeviceServices();
				}
			}
		})

	}
	///获取蓝牙设备某个服务中所有特征值(characteristic)
	function getBLEDeviceCharacteristics(serviceId) {
		uni.getBLEDeviceCharacteristics({
			deviceId: lockDeviceId.value,
			serviceId,
			success(res) {
				console.log('服务特征值:', res.characteristics)
				if (res.characteristics) {
					res.characteristics.forEach((characteristic) => {
						if (characteristic.properties.write) {
							writeCharacteristic.value = characteristic.uuid;
							if (writeCharacteristic.value) {
								const tokens = [6, 1, 1, 1, 20, 10, 68, 30, 48, 27, 10, 18, 31, 60, 47,
									10
								];
								console.log(secretKey.value);
								writeBLECharacteristicValue(encrypts(tokens, secretKey.value).buffer)
							}
						}
						if (characteristic.properties.notify || characteristic.properties.indicate) {
							uni.notifyBLECharacteristicValueChange({
								state: true,
								deviceId: lockDeviceId.value,
								serviceId,
								characteristicId: characteristic.uuid,
								success(res) {
									console.log('通知特征', res)
									///监听读写回调
									uni.onBLECharacteristicValueChange(function(res) {
										console.log('监听读写回调',res.value)
										console.log('监听读写回调', decrypts(res.value, secretKey
											.value))
										const token_datas = decrypts(res.value, secretKey
											.value);
										if (token_datas[0] == 6 && token_datas[1] == 2) {
											tokenDatas.value = token_datas;
											getPower();
										} else if (token_datas[0] == 2 &&
											token_datas[1] == 2 &&
											token_datas[2] == 1) {
											///查询电量
											isConnect.value = true;
											uni.showToast({
												title: '连接成功',
												icon: 'none'
											});
											lockStatus.value = '连接成功';
											power.value = token_datas[3];
											lockPower.value = `${token_datas[3]}%`;
											updateElectQuantity(power.value.toString());
										} else if (token_datas[0] == 5 &&
											token_datas[1] == 2 &&
											token_datas[2] == 1 && token_datas[3] == 0) {
											///开锁
											if (!isInstructClosed.value) {
												closeBLEConnect();
												if (initLockId.value) {
													eventChannel.value.emit('blueLock', {
														data: initLockId.value
													})
												}
											}
										} else if (token_datas[0] == 5 &&
											token_datas[1] == 14 &&
											token_datas[2] == 1 && isInstructClosed.value
										) {
											///关锁
											closeBLEConnect();
											if (initLockId.value) {
												eventChannel.value.emit('blueLock', {
													data: initLockId.value
												})
											}

										} else if (token_datas[0] == 5 &&
											token_datas[1] == 8 &&
											token_datas[2] == 1 && isInstructClosed.value
										) {
											console.log(token_datas);
										}
									});
								}
							})
						}
					})
				}
			},
			fail(res) {
				console.log('获取特征值失败:', res);
			}
		});
	}
	/**获取电量*/
	function getPower() {
		let datas = [];
		datas.push(2);
		datas.push(1);
		datas.push(1);
		datas.push(1);
		datas.push(tokenDatas.value[3]);
		datas.push(tokenDatas.value[4]);
		datas.push(tokenDatas.value[5]);
		datas.push(tokenDatas.value[6]);
		datas.push(0);
		datas.push(0);
		datas.push(0);
		datas.push(0);
		datas.push(0);
		datas.push(0);
		datas.push(0);
		datas.push(0);
		writeBLECharacteristicValue(encrypts(datas, secretKey.value).buffer);
	}


	///发送写入指令
	function writeBLECharacteristicValue(buffer, type) {
		console.log(buffer);
		setTimeout(() => {
			uni.writeBLECharacteristicValue({
				deviceId: lockDeviceId.value,
				serviceId: blueServiceId.value,
				characteristicId: writeCharacteristic.value,
				value: buffer,
				success(res) {
					console.log('发送指令成功', res)
					///开锁
					if (type == 'redOpen' && !isInstructClosed.value) {
						closeBLEConnect();
						if (initLockId.value) {
							eventChannel.value.emit('blueLock', {
								data: initLockId.value
							})
						}
					}
				},
				fail(res) {
					console.log('发送指令失败', res)
				}
			})
		}, 500);
	}

	///断开蓝牙
	function closeBLEConnect() {
		setTimeout(() => {
			uni.closeBLEConnection({
				deviceId: lockDeviceId.value,
				success(res) {
					isConnect.value = false;
					uni.showToast({
						title: '蓝牙已断开',
						icon: 'none'
					});
					initValue();
					console.log('断开蓝牙', res);
				}
			});
		}, 500)
	}
	/** 关锁指令*/
	function onCloseLock() {
		if ((blueType.value == '0' || blueType.value == '3') && tokenDatas.value && tokenDatas.value.length) {
			let datas = [];
			datas.push(5);
			datas.push(12);
			datas.push(1);
			datas.push(1);
			datas.push(tokenDatas.value[3]);
			datas.push(tokenDatas.value[4]);
			datas.push(tokenDatas.value[5]);
			datas.push(tokenDatas.value[6]);
			datas.push(0);
			datas.push(0);
			datas.push(0);
			datas.push(0);
			datas.push(0);
			datas.push(0);
			datas.push(0);
			datas.push(0);
			writeBLECharacteristicValue(encrypts(datas, secretKey.value).buffer);
			addUseRecords(0);
		} else if (blueType.value == '2' && lockDeviceId.value) {
			uni.showLoading({
				title: "关锁中..."
			});
			var timer = setInterval(() => {
				readRedLockInfo('lockStatus', timer);
			}, 1000)

		} else {
			uni.showToast({
				title: '请扫码连接智能锁',
				icon: 'none'
			});
		}
	}

	///断开蓝牙
	function onLockClose() {
		closeBLEConnect();
	}
	///获取电量
	function onLockPower() {
		getPower();
	}
	///开锁
	function onLockOpen() {
		if ((blueType.value == '0' || blueType.value == '3') && tokenDatas.value) {
			if (power.value < 10) {
				uni.showModal({
					title: '提示',
					content: '智能锁电量低于10%，确认继续开锁?',
					success: function(res) {
						if (res.confirm) {
							if (blueType.value == '3' && isInstructClosed.value) {
								startOpenLock(true);
							} else {
								startOpenLock();
							}

						} else if (res.cancel) {
							closeBLEConnect();
						}
					}
				});
			} else {
				if (blueType.value == '3' && isInstructClosed.value) {
					startOpenLock(true);
				} else {
					startOpenLock();
				}
			}
		} else if (blueType.value == '2' && lockDeviceId.value) {
			if (power.value < 10) {
				uni.showModal({
					title: '提示',
					content: '智能锁电量低于10%，确认继续开锁?',
					success: function(res) {
						if (res.confirm) {
							startRedOpenLock();
						} else if (res.cancel) {
							closeBLEConnect();
						}
					}
				});
			} else {
				startRedOpenLock();
			}
		} else {
			uni.showToast({
				title: '请扫码连接智能锁!',
				icon: 'none'
			});
		}
	}
	///发送开锁指令
	function startOpenLock(isCloseLock) {
		if (tokenDatas.value && tokenDatas.value.length) {
			let datas = [];
			datas.push(5);
			datas.push(1);
			datas.push(6);
			datas.push(passWord.value[0]);
			datas.push(passWord.value[1]);
			datas.push(passWord.value[2]);
			datas.push(passWord.value[3]);
			datas.push(passWord.value[4]);
			datas.push(passWord.value[5]);
			datas.push(tokenDatas.value[3]);
			datas.push(tokenDatas.value[4]);
			datas.push(tokenDatas.value[5]);
			datas.push(tokenDatas.value[6]);
			if (isCloseLock) {
				datas.push(0x5A);
				datas.push(0x78);
			} else {
				datas.push(0);
				datas.push(0);
			}
			datas.push(0);
			writeBLECharacteristicValue(encrypts(datas, secretKey.value).buffer);
			addUseRecords(1);
		} else {
			uni.showToast({
				title: '请扫码连接智能锁',
				icon: 'none'
			});
		}
	}
	///红色智能锁-开锁 
	function startRedOpenLock() {
		let openLockContent = '016E04' + passWord.value + '000000000000000000';
		console.log(openLockContent);
		let ccmEncryptVal = redAes.AES_CCM.encrypt(redAes.hex_to_bytes(openLockContent), redAes.hex_to_bytes(secretKey
			.value), redAes.hex_to_bytes(nonce.value), redAes.hex_to_bytes(initHeader), 4);
		console.log(ccmEncryptVal);
		let openLockCode = redUtil.bytesToArrayBuffer(ccmEncryptVal);
		console.log('openLockCode', openLockCode);
		writeBLECharacteristicValue(openLockCode, 'redOpen');
		addUseRecords(1);
	}

	/**初始化数据*/
	function initValue() {
		lockDeviceId.value = "";
		initLockId.value = "";
		tokenDatas.value = [];
		lockName.value = '请扫码,连接智能锁';
		lockStatus.value = '未连接';
		lockPower.value = '请连接智能锁,获取电量';
		useNumber.value = '请扫码,获取使用次数';
		lastUse.value = '请扫码,获取上次使用人/时间';
		isConnect.value = false;
	}

	/**上传电量*/
	function updateElectQuantity(electQuantity) {
		request('post', 'lock/bluetoothBase/updateElectQuantity', {
			bluetoothId: lockId.value,
			electQuantity: electQuantity
		}).then(res => {
			// 修复判断逻辑：Result<Void> 的 data 为 null 是正常的
			if (res.status !== 200 || res.code !== 200) {
				uni.showToast({
					title: '电量上传失败!',
					icon: 'none'
				});
			}
		}).catch(err => {
			console.error('电量上传失败:', err);
			uni.showToast({
				title: '电量上传失败!',
				icon: 'none'
			});
		})
	}
	/**开关锁记录*/
	function addUseRecords(lockStatus) {
		// 确保用户ID存在
		if (!user || !user.userId || user.userId.trim() === '') {
			console.warn('用户ID为空，使用默认值');
			user.userId = 'default_user_' + Date.now();
		}
		
		request('post', 'lock/bluetoothBase/addUseRecords', {
			bluetoothId: lockId.value,
			userId: user.userId,
			lockStatus: lockStatus
		}).then(res => {
			// 修复判断逻辑：Result<Void> 的 data 为 null 是正常的
			if (res.status !== 200 || res.code !== 200) {
				uni.showToast({
					title: `上传${lockStatus==1?'开锁':'关锁'}记录失败`,
					icon: 'none'
				});
			} else {
				console.log(`上传${lockStatus==1?'开锁':'关锁'}记录成功`);
			}
		}).catch(err => {
			console.error('上传使用记录失败:', err);
			uni.showToast({
				title: `上传${lockStatus==1?'开锁':'关锁'}记录失败`,
				icon: 'none'
			});
		})
	}
	///通过红色智能锁蓝牙信息
	function readRedLockInfo(readType, timer) {
		setTimeout(() => {
			uni.readBLECharacteristicValue({
				deviceId: lockDeviceId.value,
				serviceId: blueServiceId.value,
				characteristicId: readCharacteristic.value,
				success(res) {
					console.log('获取成功', res)
				},
				fail(res) {
					console.log('读取失败', res)
				}
			})

			uni.onBLECharacteristicValueChange((res) => {
				let value = redUtil.ab2hex(res.value);
				let decryptVal = '';
				try {
					decryptVal = redAes.bytes_to_hex(redAes.AES_CCM.decrypt(redAes.hex_to_bytes(value),
						redAes
						.hex_to_bytes(secretKey.value), redAes.hex_to_bytes(nonce.value), redAes
						.hex_to_bytes(
							initHeader),
						4));
				} catch (err) {
					console.log(err);
				}
				if (!decryptVal) {
					return;
				}
				if (readType == 'power') {
					power.value = parseInt(decryptVal.substring(8, 10), 16);
					lockPower.value = `${power.value}%`;
					updateElectQuantity(power.value.toString());
				} else if (readType == 'lockStatus') {
					const lockStatus = parseInt(decryptVal.substring(6, 8), 16);
					console.log(lockStatus, '锁具状态');
					if (lockStatus == 100) {
						addUseRecords(0);
						if (timer) {
							clearInterval(timer)
						}
						uni.hideLoading();
						///关锁
						closeBLEConnect();
						if (initLockId.value) {
							eventChannel.value.emit('blueLock', {
								data: initLockId.value
							})
						}
					}
				}
			})
		}, 500);
	}

	//通过ecb加密后的结果获取nonce信息
	function getNonceFromEncryptVal(ecbEncVal) {
		if (ecbEncVal) {
			if (ecbEncVal.length != 32) {
				return null;
			} else {
				var num1 = ecbEncVal.substring(16, 18);
				var num2 = ecbEncVal.substring(14, 16);
				var num3 = ecbEncVal.substring(22, 24);
				var num4 = ecbEncVal.substring(10, 12);
				var num5 = ecbEncVal.substring(4, 6);
				var num6 = ecbEncVal.substring(20, 22);
				var num7 = ecbEncVal.substring(8, 10);
				var num8 = ecbEncVal.substring(28, 30);
				var num9 = ecbEncVal.substring(0, 2);
				var num10 = ecbEncVal.substring(12, 14);
				var num11 = ecbEncVal.substring(26, 28);
				var num12 = ecbEncVal.substring(18, 20);
				return num1 + num2 + num3 + num4 + num5 + num6 + num7 + num8 + num9 + num10 + num11 + num12;
			}
		} else {
			return null;
		}
	}

	function closeBlueAdapter(isClose = false) {
		uni.closeBluetoothAdapter({
			success(res) {
				console.log('关闭蓝牙模块', res)
				isblueScan.value = false;
				if (!isClose) {
					initBlueAdapter();
				}
			}
		})
	}

	function initBlueAdapter() {
		if (!isblueScan.value) {
			uni.openBluetoothAdapter({
				success() {
					console.log('开启蓝牙成功');
					isblueScan.value = true;
					if (initLockId.value) {
						onScanLock();
					}
				},
				fail(res) {
					console.log(res);
					if (res.errno === 103) {
						isblueScan.value = false;
						uni.showModal({
							title: '你需要授予蓝牙权限',
							content: '请前往设置，将蓝牙权限选择为允许',
							confirmText: '去设置',
							success: function(res) {
								if (res.confirm) {
									uni.openSetting({
										success(res) {
											console.log(res.authSetting)
											if (res.authSetting['scope.bluetooth']) {
												isblueScan.value = true;
											}
										},
										fail(res) {
											console.log(res)
										}
									});
								}
							}
						});
					} else if (res.errno === 1500102) {
						uni.showToast({
							title: '请打开手机蓝牙',
							icon: 'none'
						});
						isblueScan.value = false;
					} else {
						uni.showToast({
							title: `蓝牙不可用${res.errMsg}`,
							icon: 'none'
						});
					}
				},
				complete(res) {
					uni.onBluetoothAdapterStateChange(function(res) {
						console.log('状态', res)
						if (res.available) {
							isblueScan.value = true;
						} else {
							isblueScan.value = false;
						}
						console.log(isblueScan.value);
					})
				}
			})
		}
	}

	onLoad((option) => {
		console.log('旧');
		uni.setNavigationBarTitle({
			title: '智能锁-开锁'
		});
		if (proxy && proxy.getOpenerEventChannel) {
			eventChannel.value = proxy.getOpenerEventChannel();
		}
		initValue();
		if (option && option.initLockId) {
			initLockId.value = option.initLockId;
		}
		if (option && option.toHome) {
			toHome.value = true;
		}

		if (option && option.q) {
			const query = decodeURIComponent(option.q);
			const queryParams = getParamsFromUrl(query);
			console.log(queryParams);
			const initLockIdParam = getQueryString(query, "initLockId");
			if (initLockIdParam) {
				initLockId.value = initLockIdParam;
			}
		}
	})

	onShow(() => {
		console.log('onShow','+++++++++');
		initBlueAdapter();
	})

	onUnload(() => {
		if (initLockId.value && eventChannel.value) {
			eventChannel.value.emit('back', 'back')
		}
		closeBlueAdapter(true);
		if (toHome.value) {
			uni.switchTab({
				url: '/pages/home/home'
			})
		}
	})
</script>

<style lang="scss">
	.lock_container {
		padding: 20rpx 10rpx;

		.lock-content {
			display: flex;
			align-items: center;

			.lock-text {
				flex: 1;
				height: 80rpx;
				border: 1rpx solid #bfbfbf;
				margin: 0 10rpx;
				border-radius: 10rpx;
			}

			.lock-text2 {
				flex: 1;
				height: 80rpx;
				border: 1rpx solid #bfbfbf;
				border-radius: 10rpx;
				margin-left: 10rpx;
			}

			.text-red {
				color: #D32F2F;
				display: flex;
				justify-content: center;
				align-items: center;
			}

			.text-green {
				color: #689F38;
				display: flex;
				justify-content: center;
				align-items: center;
			}

			.btn-box {
				display: flex;
				justify-content: center;
				align-items: center;
				height: 48rpx;
				color: #FFFFFF;
				background: #3987f4;
				padding: 10rpx;
				border-radius: 10rpx;

				image {
					width: 40rpx;
					height: 40rpx;
					margin-right: 10rpx;
				}

				.img-btn {}
			}
		}

		.lock-style {
			margin-top: 20rpx;
		}

		.lock-open {
			display: flex;
			margin-top: 80rpx;

			.btn {
				display: flex;
				justify-content: center;
				align-items: center;
				width: 100%;
				height: 100rpx;
				border-radius: 15rpx;
				font-size: 35rpx;
				letter-spacing: 5rpx;
				margin: 4rpx;
			}

			.open {
				color: #FFFFFF;
				background: #3987f4;
			}

			.close {
				color: #FFFFFF;
				background: #8B1A1A;
			}
		}
	}
</style>

