function compareVersion(v1, v2) {
	v1 = v1.split('.')
	v2 = v2.split('.')
	const len = Math.max(v1.length, v2.length)

	while (v1.length < len) {
		v1.push('0')
	}
	while (v2.length < len) {
		v2.push('0')
	}

	for (let i = 0; i < len; i++) {
		const num1 = parseInt(v1[i], 10)
		const num2 = parseInt(v2[i], 10)

		if (num1 > num2) {
			return 1
		} else if (num1 < num2) {
			return -1
		}
	}

	return 0
}

//时间戳
function timestampToTime(timestamp) {
	if (timestamp == null) {
		return "";
	}
	var date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
	var Y = date.getFullYear() + '-';
	var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
	var D = date.getDate() + ' ';
	var h = date.getHours() + ':';
	var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
	var s = ':' + date.getSeconds();
	return Y + M + D + h + m;
};


// ArrayBuffer转16进度字符串示例
function ab2hex(buffer) {
	var hexArr = Array.prototype.map.call(
		new Uint8Array(buffer),
		function(bit) {
			return ('00' + bit.toString(16)).slice(-2)
		}
	)
	return hexArr.join('');
}

function formatMac(mac) {
	if (!mac) return '';
	var formatMac = '';
	for (var i = 0; i < mac.length / 2; i++) {
		formatMac += mac.substring(2 * i, 2 * (i + 1));
		if (i != mac.length / 2 - 1) {
			formatMac += ':';
		}
	}
	return formatMac.toUpperCase();
}

function bytesToArrayBuffer(bytes) {
	let buffer = new ArrayBuffer(bytes.length);
	let dataView = new DataView(buffer);
	for (let i = 0; i < bytes.length; i++) {
		dataView.setUint8(i, bytes[i]);
	}
	return buffer;
}

const ipReg = /^((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))$/;

const portReg = /^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/;

function intToIp(int) {
	return (int >>> 24) + "." + (int >> 16 & 0xFF) + "." + (int >> 8 & 0xFF) + "." + (int & 0xFF);
}

/**
 * 判断字符串是否是链接
 * @param {Object} str
 */
function isLink(str) {
	const pattern = /(https?|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/;
	return pattern.test(str);
}

function intStrToHexStr(str, base) {
	let val = parseInt(str).toString(16);
	while (val.length < base) {
		val = '0' + val;
	}
	return val;
}

function ipToHexStr(ip) {
	let val = ip.split('.');
	return intStrToHexStr(val[0], 2) + intStrToHexStr(val[1], 2) + intStrToHexStr(val[2], 2) + intStrToHexStr(val[3],
		2);
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
	isLink
}