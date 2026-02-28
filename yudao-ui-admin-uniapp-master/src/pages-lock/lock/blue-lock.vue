<template>
  <view class="lock_container">
    <view class="lock-content">
      <text>锁具编号:</text>
      <text class="lock-text" :class="isConnect ? 'text-green' : 'text-red'">{{ lockName }}</text>
      <view class="btn-box">
        <image mode="aspectFit" src="https://aq.sglototo.com/wechat/static/scan_lock.png" />
        <view class="img-btn" @click="onScanLock">扫 码</view>
      </view>
    </view>
    <view class="lock-content lock-style">
      <text>连接状态:</text>
      <text class="lock-text" :class="isConnect ? 'text-green' : 'text-red'">{{ lockStatus }}</text>
      <view class="btn-box">
        <image mode="aspectFit" src="https://aq.sglototo.com/wechat/static/lock_close.png" />
        <view class="img-btn" @click="onLockClose">断 开</view>
      </view>
    </view>
    <view class="lock-content lock-style">
      <text>剩余电量:</text>
      <text class="lock-text" :class="isConnect ? 'text-green' : 'text-red'">{{ lockPower }}</text>
      <view class="btn-box">
        <image mode="aspectFit" src="https://aq.sglototo.com/wechat/static/battery_unknown.png" />
        <view class="img-btn" @click="onLockPower">获 取</view>
      </view>
    </view>
    <view class="lock-content lock-style">
      <text>使用次数:</text>
      <text class="lock-text2" :class="isConnect ? 'text-green' : 'text-red'">{{ useNumber }}</text>
    </view>
    <view class="lock-content lock-style">
      <view style="display: flex; flex-direction: column;">
        <text>上次使用</text>
        <text>人/时间</text>
      </view>
      <text>:</text>
      <text class="lock-text2" :class="isConnect ? 'text-green' : 'text-red'">{{ lastUse }}</text>
    </view>

    <view class="lock-open">
      <view class="btn open" @click="onLockOpen()">开 锁</view>
      <view v-if="isInstructClosed" class="btn close" @click="onCloseLock()">关 锁</view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, getCurrentInstance } from 'vue'
import { onShow, onLoad, onUnload } from '@dcloudio/uni-app'
import { encrypts, decrypts } from '@/utils/lock/crypto'
import { getBluetoothBaseInfo, addUseRecords, updateElectQuantity } from '@/api/lock/bluetooth-base'
import { useUserStore } from '@/store'
import redUtil from '@/utils/lock/util'
import { getQueryString, getParamsFromUrl } from '@/utils/lock'
import * as redAes from '@/utils/lock/aes/entry-export_all'

const { proxy } = getCurrentInstance()
const userStore = useUserStore()

const lockName = ref('')
const lockStatus = ref('')
const lockPower = ref('')
const useNumber = ref('')
const lastUse = ref('')

/// 判断蓝牙是否可用
const isblueScan = ref(false)
/// 是否已连接
const isConnect = ref(false)

const lockDeviceId = ref('')

/// 写入的特征UUID
const writeCharacteristic = ref('')
/// 读取服务特征
const readCharacteristic = ref('')
/// 蓝牙服务ID
const blueServiceId = ref('')

/// 开锁密码
const passWord = ref<number[] | string | null>(null)
/// key
const secretKey = ref<number[] | string | null>(null)
/// 锁Id
const lockId = ref('')
/// 智能锁类型
const blueType = ref('')
/// 红色智能锁随机数
const randomVal = ref('')
const seriesNum = ref('')
const nonce = ref('')
const initHeader = '6c696e6b706f7765723836323331'

/// 令牌
const tokenDatas = ref<number[]>([])
/// 电量
const power = ref(0)

const initLockId = ref('')

/// 是否有关锁功能
const isInstructClosed = ref(false)

const eventChannel = ref<any>(null)

const toHome = ref(false)

// 获取MAC地址
function getMacPath(buffer: ArrayBuffer) {
  const hexArr = Array.prototype.map.call(
    new Uint8Array(buffer),
    (bit: number) => (`00${bit.toString(16)}`).slice(-2),
  )
  console.log(hexArr)
  let mac: string
  if (blueType.value === '0' || blueType.value === '3') {
    mac = hexArr.slice(2, 8).join(':')
  }
  else {
    mac = hexArr.slice(9, 15).join(':')
  }
  return mac ? mac.toUpperCase() : ''
}

// ArrayBuffer转16进度字符串示例
function ab2hex(buffer: ArrayBuffer) {
  const hexArr = Array.prototype.map.call(
    new Uint8Array(buffer),
    (bit: number) => (`00${bit.toString(16)}`).slice(-2),
  )
  return hexArr
}

/// 扫码智能锁
function onScanLock() {
  if (isblueScan.value) {
    // 允许从相机和相册扫码
    if (initLockId.value) {
      getBluetoothBaseInfoById(initLockId.value)
    }
    else {
      uni.scanCode({
        scanType: ['qrCode'],
        success(res) {
          console.log('条码内容：' + res.result)
          let codeResult = ''
          if (redUtil.isLink(res.result)) {
            codeResult = JSON.parse(getQueryString(res.result, 'initLockData') || '{}')
            console.log('条码内容1：' + codeResult)
          }
          else {
            codeResult = res.result
            console.log('条码内容2：' + codeResult)
          }
          getBluetoothBaseInfoById(codeResult)
        },
      })
    }
  }
  else {
    uni.showToast({
      title: '请打开蓝牙或将蓝牙权限设置为允许',
      icon: 'none',
    })
  }
}

/** 查询蓝牙信息 */
function getBluetoothBaseInfoById(barcode: string) {
  if (barcode && barcode.split(',')[0] === 'blueLock') {
    const id = barcode.split(',')[1]
    uni.showLoading({
      title: '正在获取智能锁信息...',
    })
    getBluetoothBaseInfo(id)
      .then((response) => {
        if (response && response.answerQuestion && response.answerQuestion === '1') {
          // 如果需要答题，这里可以跳转到答题页面
          uni.showToast({
            title: '该锁需要答题开锁',
            icon: 'none',
          })
        }
        else {
          /// 开始搜索
          startBluetoothDevicesDiscovery(response)
        }
      })
      .catch((err) => {
        console.error('获取设备信息失败:', err)
        uni.showToast({
          title: '获取设备信息失败',
          icon: 'none',
        })
      })
      .finally(() => {
        uni.hideLoading()
      })
  }
  else {
    uni.showToast({
      title: '请扫正确的智能锁二维码',
      icon: 'none',
    })
  }
}

/// 开始搜索蓝牙
function startBluetoothDevicesDiscovery(response: any) {
  if (response && response.mac) {
    uni.showLoading({
      title: '正在搜索蓝牙,请唤醒智能锁...',
    })

    const items = response
    if (items.isInstructClosed && items.isInstructClosed === '1') {
      isInstructClosed.value = true
    }
    else {
      isInstructClosed.value = false
    }
    blueType.value = items.blueType
    if (blueType.value === '0' || blueType.value === '3') {
      passWord.value = items.password.split(',').map((e: string) => Number(e))
      console.log(passWord.value, '开锁密码')
      secretKey.value = items.secretKey.split(',').map((e: string) => Number(e))
      console.log(secretKey.value, '密钥')
    }
    else if (blueType.value === '2') {
      console.log(items, '红色')
      passWord.value = items.password
      secretKey.value = items.secretKey
    }

    lockName.value = items.lockNum
    lockId.value = items.id
    useNumber.value = items.useCount || ''
    lastUse.value = `${items.lastUser || ''}/${items.lastUseTime || ''}`
    const mac = items.mac
    uni.startBluetoothDevicesDiscovery({
      success(res) {
        /// 监听搜索蓝牙设备
        uni.onBluetoothDeviceFound((device) => {
          console.log(device)
          const macPath = getMacPath(device.devices[0].advertisData)
          if (macPath && macPath === mac) {
            lockDeviceId.value = device.devices[0].deviceId
            /// 停止搜索
            uni.stopBluetoothDevicesDiscovery({
              success(res) {
                console.log('停止搜索', res)
              },
              complete(res) {
                if (blueType.value === '2') {
                  lockStatus.value = '连接成功'
                  console.log(device.devices[0].advertisData, '红色智能锁')
                  const broadcast = redUtil.ab2hex(device.devices[0].advertisData)

                  randomVal.value = broadcast.substring(0, 8)

                  seriesNum.value = broadcast.substring(8, 12)

                  const mic = randomVal.value + '000000000000000000000000'

                  const ecbEncryptVal = redAes.bytes_to_hex(redAes.AES_ECB.encrypt(
                    redAes.hex_to_bytes(mic), redAes.hex_to_bytes(secretKey.value as string),
                  ))

                  nonce.value = getNonceFromEncryptVal(ecbEncryptVal)
                }
                createBLEConnect()
              },
            })
          }
        })
      },
      complete(res) {
        // uni.hideLoading();
      },
    })
  }
  else {
    if (response && response.message && response.message.length > 7) {
      uni.hideLoading()
      uni.showModal({
        title: '提示',
        content: response.message,
        confirmText: '确定',
        showCancel: false,
      })
    }
    else {
      uni.showToast({
        title: `${response?.message || '获取设备信息失败'}`,
        icon: 'none',
      })
    }
  }
}

/// 连接设备
function createBLEConnect() {
  // 如果已有连接，先断开
  if (isConnect.value && lockDeviceId.value) {
    uni.closeBLEConnection({
      deviceId: lockDeviceId.value,
      success() {
        console.log('断开旧连接')
        setTimeout(() => {
          doCreateBLEConnect()
        }, 500)
      },
      fail() {
        // 断开失败也继续尝试连接
        doCreateBLEConnect()
      },
    })
  }
  else {
    doCreateBLEConnect()
  }
}

/// 执行创建蓝牙连接
function doCreateBLEConnect() {
  uni.showLoading({
    title: '正在连接蓝牙...',
  })
  const timeout = 10000 // 10S
  uni.createBLEConnection({
    deviceId: lockDeviceId.value,
    timeout,
    success(res) {
      isConnect.value = true
      console.log('连接成功', res)
      getBLEDeviceServices()
    },
    fail(res) {
      console.log('连接失败', res)
      uni.showToast({
        title: '连接失败',
        icon: 'none',
      })
      initValue()
    },
    complete(res) {
      uni.hideLoading()
    },
  })
}

/// 监听低功耗蓝牙连接状态的改变事件
uni.onBLEConnectionStateChange((res) => {
  isConnect.value = res.connected
  if (!isConnect.value) {
    uni.showToast({
      title: '已断开蓝牙',
      icon: 'none',
    })
    initValue()
    closeBlueAdapter()
  }
})

/// 获取蓝牙服务
function getBLEDeviceServices() {
  uni.getBLEDeviceServices({
    deviceId: lockDeviceId.value,
    success(res) {
      console.log('蓝牙设备服务:', res.services)
      if (res.services && res.services.length > 0) {
        if (blueType.value === '0' || blueType.value === '3') {
          const primaryService = res.services.find((item: any) => item.uuid.includes('0000FEE7') && item.isPrimary)
          blueServiceId.value = primaryService.uuid
          getBLEDeviceCharacteristics(primaryService.uuid)
        }
        else if (blueType.value === '2') {
          blueServiceId.value = '0000CCD0-0000-1000-8000-00805F9B34FB'
          uni.getBLEDeviceCharacteristics({
            deviceId: lockDeviceId.value,
            serviceId: blueServiceId.value,
            success(res) {
              console.log('服务特征值:', res.characteristics)
              readCharacteristic.value = '0000CCD1-0000-1000-8000-00805F9B34FB'
              writeCharacteristic.value = '0000CCD2-0000-1000-8000-00805F9B34FB'
              readRedLockInfo('power')
            },
            fail(res) {
              console.log('获取特征值失败:', res)
            },
          })
        }
      }
      else {
        getBLEDeviceServices()
      }
    },
  })
}

/// 获取蓝牙设备某个服务中所有特征值(characteristic)
function getBLEDeviceCharacteristics(serviceId: string) {
  uni.getBLEDeviceCharacteristics({
    deviceId: lockDeviceId.value,
    serviceId,
    success(res) {
      console.log('服务特征值:', res.characteristics)
      if (res.characteristics) {
        res.characteristics.forEach((characteristic: any) => {
          if (characteristic.properties.write) {
            writeCharacteristic.value = characteristic.uuid
            if (writeCharacteristic.value) {
              const tokens = [6, 1, 1, 1, 20, 10, 68, 30, 48, 27, 10, 18, 31, 60, 47, 10]
              console.log(secretKey.value)
              writeBLECharacteristicValue(encrypts(tokens, secretKey.value as number[]).buffer)
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
                /// 监听读写回调
                uni.onBLECharacteristicValueChange((res) => {
                  console.log('监听读写回调', res.value)
                  console.log('监听读写回调', decrypts(res.value, secretKey.value as number[]))
                  const token_datas = decrypts(res.value, secretKey.value as number[])
                  if (token_datas && token_datas[0] === 6 && token_datas[1] === 2) {
                    tokenDatas.value = Array.from(token_datas)
                    getPower()
                  }
                  else if (token_datas && token_datas[0] === 2 && token_datas[1] === 2 && token_datas[2] === 1) {
                    /// 查询电量
                    isConnect.value = true
                    uni.showToast({
                      title: '连接成功',
                      icon: 'none',
                    })
                    lockStatus.value = '连接成功'
                    power.value = token_datas[3]
                    lockPower.value = `${token_datas[3]}%`
                    updateElectQuantityToServer(power.value.toString())
                  }
                  else if (token_datas && token_datas[0] === 5 && token_datas[1] === 2 && token_datas[2] === 1 && token_datas[3] === 0) {
                    /// 开锁
                    if (!isInstructClosed.value) {
                      closeBLEConnect()
                      if (initLockId.value && eventChannel.value) {
                        eventChannel.value.emit('blueLock', {
                          data: initLockId.value,
                        })
                      }
                    }
                  }
                  else if (token_datas && token_datas[0] === 5 && token_datas[1] === 14 && token_datas[2] === 1 && isInstructClosed.value) {
                    /// 关锁
                    closeBLEConnect()
                    if (initLockId.value && eventChannel.value) {
                      eventChannel.value.emit('blueLock', {
                        data: initLockId.value,
                      })
                    }
                  }
                  else if (token_datas && token_datas[0] === 5 && token_datas[1] === 8 && token_datas[2] === 1 && isInstructClosed.value) {
                    console.log(token_datas)
                  }
                })
              },
            })
          }
        })
      }
    },
    fail(res) {
      console.log('获取特征值失败:', res)
    },
  })
}

/** 获取电量 */
function getPower() {
  if (!tokenDatas.value || tokenDatas.value.length < 7) {
    return
  }
  const datas: number[] = []
  datas.push(2)
  datas.push(1)
  datas.push(1)
  datas.push(1)
  datas.push(tokenDatas.value[3])
  datas.push(tokenDatas.value[4])
  datas.push(tokenDatas.value[5])
  datas.push(tokenDatas.value[6])
  datas.push(0, 0, 0, 0, 0, 0, 0, 0)
  writeBLECharacteristicValue(encrypts(datas, secretKey.value as number[]).buffer)
}

/// 发送写入指令
function writeBLECharacteristicValue(buffer: ArrayBuffer, type?: string) {
  console.log(buffer)
  setTimeout(() => {
    uni.writeBLECharacteristicValue({
      deviceId: lockDeviceId.value,
      serviceId: blueServiceId.value,
      characteristicId: writeCharacteristic.value,
      value: buffer,
      success(res) {
        console.log('发送指令成功', res)
        /// 开锁
        if (type === 'redOpen' && !isInstructClosed.value) {
          closeBLEConnect()
          if (initLockId.value && eventChannel.value) {
            eventChannel.value.emit('blueLock', {
              data: initLockId.value,
            })
          }
        }
      },
      fail(res) {
        console.log('发送指令失败', res)
      },
    })
  }, 500)
}

/// 断开蓝牙
function closeBLEConnect() {
  setTimeout(() => {
    uni.closeBLEConnection({
      deviceId: lockDeviceId.value,
      success(res) {
        isConnect.value = false
        uni.showToast({
          title: '蓝牙已断开',
          icon: 'none',
        })
        initValue()
        console.log('断开蓝牙', res)
      },
    })
  }, 500)
}

/** 关锁指令 */
function onCloseLock() {
  if ((blueType.value === '0' || blueType.value === '3') && tokenDatas.value && tokenDatas.value.length) {
    const datas: number[] = []
    datas.push(5)
    datas.push(12)
    datas.push(1)
    datas.push(1)
    datas.push(tokenDatas.value[3])
    datas.push(tokenDatas.value[4])
    datas.push(tokenDatas.value[5])
    datas.push(tokenDatas.value[6])
    datas.push(0, 0, 0, 0, 0, 0, 0, 0)
    writeBLECharacteristicValue(encrypts(datas, secretKey.value as number[]).buffer)
    addUseRecordsToServer(0)
  }
  else if (blueType.value === '2' && lockDeviceId.value) {
    uni.showLoading({
      title: '关锁中...',
    })
    const timer = setInterval(() => {
      readRedLockInfo('lockStatus', timer)
    }, 1000)
  }
  else {
    uni.showToast({
      title: '请扫码连接智能锁',
      icon: 'none',
    })
  }
}

/// 断开蓝牙
function onLockClose() {
  closeBLEConnect()
}

/// 获取电量
function onLockPower() {
  getPower()
}

/// 开锁
function onLockOpen() {
  if ((blueType.value === '0' || blueType.value === '3') && tokenDatas.value) {
    if (power.value < 10) {
      uni.showModal({
        title: '提示',
        content: '智能锁电量低于10%，确认继续开锁?',
        success(res) {
          if (res.confirm) {
            if (blueType.value === '3' && isInstructClosed.value) {
              startOpenLock(true)
            }
            else {
              startOpenLock()
            }
          }
          else if (res.cancel) {
            closeBLEConnect()
          }
        },
      })
    }
    else {
      if (blueType.value === '3' && isInstructClosed.value) {
        startOpenLock(true)
      }
      else {
        startOpenLock()
      }
    }
  }
  else if (blueType.value === '2' && lockDeviceId.value) {
    if (power.value < 10) {
      uni.showModal({
        title: '提示',
        content: '智能锁电量低于10%，确认继续开锁?',
        success(res) {
          if (res.confirm) {
            startRedOpenLock()
          }
          else if (res.cancel) {
            closeBLEConnect()
          }
        },
      })
    }
    else {
      startRedOpenLock()
    }
  }
  else {
    uni.showToast({
      title: '请扫码连接智能锁!',
      icon: 'none',
    })
  }
}

/// 发送开锁指令
function startOpenLock(isCloseLock?: boolean) {
  if (tokenDatas.value && tokenDatas.value.length) {
    const datas: number[] = []
    datas.push(5)
    datas.push(1)
    datas.push(6)
    if (Array.isArray(passWord.value)) {
      datas.push(...passWord.value.slice(0, 6))
    }
    datas.push(tokenDatas.value[3])
    datas.push(tokenDatas.value[4])
    datas.push(tokenDatas.value[5])
    datas.push(tokenDatas.value[6])
    if (isCloseLock) {
      datas.push(0x5A)
      datas.push(0x78)
    }
    else {
      datas.push(0, 0)
    }
    datas.push(0)
    writeBLECharacteristicValue(encrypts(datas, secretKey.value as number[]).buffer)
    addUseRecordsToServer(1)
  }
  else {
    uni.showToast({
      title: '请扫码连接智能锁',
      icon: 'none',
    })
  }
}

/// 红色智能锁-开锁
function startRedOpenLock() {
  const openLockContent = `016E04${passWord.value}000000000000000000`
  console.log(openLockContent)
  const ccmEncryptVal = redAes.AES_CCM.encrypt(
    redAes.hex_to_bytes(openLockContent),
    redAes.hex_to_bytes(secretKey.value as string),
    redAes.hex_to_bytes(nonce.value),
    redAes.hex_to_bytes(initHeader),
    4,
  )
  console.log(ccmEncryptVal)
  const openLockCode = redUtil.bytesToArrayBuffer(Array.from(ccmEncryptVal))
  console.log('openLockCode', openLockCode)
  writeBLECharacteristicValue(openLockCode, 'redOpen')
  addUseRecordsToServer(1)
}

/** 初始化数据 */
function initValue() {
  lockDeviceId.value = ''
  initLockId.value = ''
  tokenDatas.value = []
  lockName.value = '请扫码,连接智能锁'
  lockStatus.value = '未连接'
  lockPower.value = '请连接智能锁,获取电量'
  useNumber.value = '请扫码,获取使用次数'
  lastUse.value = '请扫码,获取上次使用人/时间'
  isConnect.value = false
}

/** 上传电量 */
function updateElectQuantityToServer(electQuantity: string) {
  updateElectQuantity({
    bluetoothId: lockId.value,
    electQuantity: Number.parseInt(electQuantity),
  })
    .then(() => {
      console.log('电量上传成功')
    })
    .catch((err) => {
      console.error('电量上传失败:', err)
      uni.showToast({
        title: '电量上传失败!',
        icon: 'none',
      })
    })
}

/** 开关锁记录 */
function addUseRecordsToServer(lockStatus: number) {
  const userId = userStore.userInfo?.userId?.toString() || ''
  if (!userId) {
    console.warn('用户ID为空，无法记录使用记录')
    uni.showToast({
      title: '用户信息获取失败',
      icon: 'none',
    })
    return
  }

  addUseRecords({
    bluetoothId: lockId.value,
    userId,
    lockStatus,
  })
    .then(() => {
      console.log(`上传${lockStatus === 1 ? '开锁' : '关锁'}记录成功`)
    })
    .catch((err) => {
      console.error('上传使用记录失败:', err)
      uni.showToast({
        title: `上传${lockStatus === 1 ? '开锁' : '关锁'}记录失败`,
        icon: 'none',
      })
    })
}

/// 通过红色智能锁蓝牙信息
function readRedLockInfo(readType: string, timer?: any) {
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
      },
    })

    uni.onBLECharacteristicValueChange((res) => {
      const value = redUtil.ab2hex(res.value)
      let decryptVal = ''
      try {
        decryptVal = redAes.bytes_to_hex(redAes.AES_CCM.decrypt(
          redAes.hex_to_bytes(value),
          redAes.hex_to_bytes(secretKey.value as string),
          redAes.hex_to_bytes(nonce.value),
          redAes.hex_to_bytes(initHeader),
          4,
        ))
      }
      catch (err) {
        console.log(err)
      }
      if (!decryptVal) {
        return
      }
      if (readType === 'power') {
        power.value = Number.parseInt(decryptVal.substring(8, 10), 16)
        lockPower.value = `${power.value}%`
        updateElectQuantityToServer(power.value.toString())
      }
      else if (readType === 'lockStatus') {
        const lockStatus = Number.parseInt(decryptVal.substring(6, 8), 16)
        console.log(lockStatus, '锁具状态')
        if (lockStatus === 100) {
          addUseRecordsToServer(0)
          if (timer) {
            clearInterval(timer)
          }
          uni.hideLoading()
          /// 关锁
          closeBLEConnect()
          if (initLockId.value && eventChannel.value) {
            eventChannel.value.emit('blueLock', {
              data: initLockId.value,
            })
          }
        }
      }
    })
  }, 500)
}

// 通过ecb加密后的结果获取nonce信息
function getNonceFromEncryptVal(ecbEncVal: string) {
  if (ecbEncVal) {
    if (ecbEncVal.length !== 32) {
      return null
    }
    else {
      const num1 = ecbEncVal.substring(16, 18)
      const num2 = ecbEncVal.substring(14, 16)
      const num3 = ecbEncVal.substring(22, 24)
      const num4 = ecbEncVal.substring(10, 12)
      const num5 = ecbEncVal.substring(4, 6)
      const num6 = ecbEncVal.substring(20, 22)
      const num7 = ecbEncVal.substring(8, 10)
      const num8 = ecbEncVal.substring(28, 30)
      const num9 = ecbEncVal.substring(0, 2)
      const num10 = ecbEncVal.substring(12, 14)
      const num11 = ecbEncVal.substring(26, 28)
      const num12 = ecbEncVal.substring(18, 20)
      return num1 + num2 + num3 + num4 + num5 + num6 + num7 + num8 + num9 + num10 + num11 + num12
    }
  }
  else {
    return null
  }
}

function closeBlueAdapter(isClose = false) {
  uni.closeBluetoothAdapter({
    success(res) {
      console.log('关闭蓝牙模块', res)
      isblueScan.value = false
      if (!isClose) {
        initBlueAdapter()
      }
    },
  })
}

function initBlueAdapter() {
  if (!isblueScan.value) {
    uni.openBluetoothAdapter({
      success() {
        console.log('开启蓝牙成功')
        isblueScan.value = true
        if (initLockId.value) {
          onScanLock()
        }
      },
      fail(res) {
        console.log(res)
        if (res.errno === 103) {
          isblueScan.value = false
          uni.showModal({
            title: '你需要授予蓝牙权限',
            content: '请前往设置，将蓝牙权限选择为允许',
            confirmText: '去设置',
            success(res) {
              if (res.confirm) {
                uni.openSetting({
                  success(res) {
                    console.log(res.authSetting)
                    if (res.authSetting['scope.bluetooth']) {
                      isblueScan.value = true
                    }
                  },
                  fail(res) {
                    console.log(res)
                  },
                })
              }
            },
          })
        }
        else if (res.errno === 1500102) {
          uni.showToast({
            title: '请打开手机蓝牙',
            icon: 'none',
          })
          isblueScan.value = false
        }
        else {
          uni.showToast({
            title: `蓝牙不可用${res.errMsg}`,
            icon: 'none',
          })
        }
      },
      complete(res) {
        uni.onBluetoothAdapterStateChange((res) => {
          console.log('状态', res)
          if (res.available) {
            isblueScan.value = true
          }
          else {
            isblueScan.value = false
          }
          console.log(isblueScan.value)
        })
      },
    })
  }
}

onLoad((option) => {
  console.log('旧')
  uni.setNavigationBarTitle({
    title: '智能锁-开锁',
  })
  if (proxy && (proxy as any).getOpenerEventChannel) {
    eventChannel.value = (proxy as any).getOpenerEventChannel()
  }
  initValue()
  
  // 优先从直接参数获取 initLockId
  if (option && option.initLockId) {
    initLockId.value = option.initLockId as string
  }
  
  // 从 query string 中获取参数（兼容 URL 参数传递方式）
  if (option && option.q) {
    const query = decodeURIComponent(option.q as string)
    const queryParams = getParamsFromUrl(query)
    console.log(queryParams)
    const initLockIdParam = getQueryString(query, 'initLockId')
    if (initLockIdParam && !initLockId.value) {
      initLockId.value = initLockIdParam
    }
  }
  
  // 如果通过 URL 参数传递（非 query string），直接从 option 中获取
  if (!initLockId.value && option) {
    // 尝试从 option 的所有键中查找 initLockId
    Object.keys(option).forEach((key) => {
      if (key === 'initLockId' && option[key]) {
        initLockId.value = option[key] as string
      }
    })
  }
  
  if (option && option.toHome) {
    toHome.value = true
  }
})

onShow(() => {
  console.log('onShow', '+++++++++')
  initBlueAdapter()
})

onUnload(() => {
  if (initLockId.value && eventChannel.value) {
    eventChannel.value.emit('back', 'back')
  }
  closeBlueAdapter(true)
  if (toHome.value) {
    uni.switchTab({
      url: '/pages/index/index',
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
      color: #d32f2f;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .text-green {
      color: #689f38;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .btn-box {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 48rpx;
      color: #ffffff;
      background: #3987f4;
      padding: 10rpx;
      border-radius: 10rpx;

      image {
        width: 40rpx;
        height: 40rpx;
        margin-right: 10rpx;
      }

      .img-btn {
      }
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
      color: #ffffff;
      background: #3987f4;
    }

    .close {
      color: #ffffff;
      background: #8b1a1a;
    }
  }
}
</style>

