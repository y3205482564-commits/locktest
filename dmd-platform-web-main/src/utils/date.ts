import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);

type FormatDate = Date | dayjs.Dayjs | number | string;

type Format =
    | 'HH'
    | 'HH:mm'
    | 'HH:mm:ss'
    | 'YYYY'
    | 'YYYY-MM'
    | 'YYYY-MM-DD'
    | 'YYYY-MM-DD HH'
    | 'YYYY-MM-DD HH:mm'
    | 'YYYY-MM-DD HH:mm:ss'
    | (string & {});

export function formatDate(time?: FormatDate, format: Format = 'YYYY-MM-DD') {
    // 日期不存在，则返回空
    if (!time) {
        return '';
    }
    try {
        const date = dayjs.isDayjs(time) ? time : dayjs(time);
        if (!date.isValid()) {
            throw new Error('Invalid date');
        }
        return date.tz().format(format);
    } catch (error) {
        console.error(`Error formatting date: ${error}`);
        return String(time ?? '');
    }
}

export function formatDateTime(time?: FormatDate) {
    return formatDate(time, 'YYYY-MM-DD HH:mm:ss');
}

export function formatDate2(date: Date, format?: string): string {
    // 日期不存在，则返回空
    if (!date) {
        return '';
    }
    // 日期存在，则进行格式化
    return date ? dayjs(date).format(format ?? 'YYYY-MM-DD HH:mm:ss') : '';
}

export function isDate(value: any): value is Date {
    return value instanceof Date;
}

export function isDayjsObject(value: any): value is dayjs.Dayjs {
    return dayjs.isDayjs(value);
}

/**
 * element plus 的时间 Formatter 实现，使用 YYYY-MM-DD HH:mm:ss 格式
 *
 * @param _row
 * @param _column
 * @param cellValue 字段值
 */
export function dateFormatter(_row: any, _column: any, cellValue: any): string {
    return cellValue ? formatDate(cellValue)?.toString() || '' : '';
}

/**
 * 获取当前时区
 * @returns 当前时区
 */
export const getSystemTimezone = () => {
    return dayjs.tz.guess();
};

/**
 * 自定义设置的时区
 */
let currentTimezone = getSystemTimezone();

/**
 * 设置默认时区
 * @param timezone
 */
export const setCurrentTimezone = (timezone?: string) => {
    currentTimezone = timezone || getSystemTimezone();
    dayjs.tz.setDefault(currentTimezone);
};

/**
 * 获取设置的时区
 * @returns 设置的时区
 */
export const getCurrentTimezone = () => {
    return currentTimezone;
};

/**
 * 将毫秒，转换成时间字符串。例如说，xx 分钟
 *
 * @param ms 毫秒
 * @returns {string} 字符串
 */
export function formatPast2(ms: number): string {
    const day = Math.floor(ms / (24 * 60 * 60 * 1000));
    const hour = Math.floor(ms / (60 * 60 * 1000) - day * 24);
    const minute = Math.floor(ms / (60 * 1000) - day * 24 * 60 - hour * 60);
    const second = Math.floor(
        ms / 1000 - day * 24 * 60 * 60 - hour * 60 * 60 - minute * 60,
    );
    if (day > 0) {
        return `${day} 天${hour} 小时 ${minute} 分钟`;
    }
    if (hour > 0) {
        return `${hour} 小时 ${minute} 分钟`;
    }
    if (minute > 0) {
        return `${minute} 分钟`;
    }
    return second > 0 ? `${second} 秒` : `${0} 秒`;
}
