import type { RouteLocationNormalized, RouteRecordNormalized } from 'vue-router'
import type { App, Component } from 'vue'
import { intersectionWith, isEqual, mergeWith, unionWith } from 'lodash-es'
import { unref } from 'vue'
import { isArray, isObject } from '@/utils/is'

export function noop() {}

/**
 * @description:  Set ui mount node
 */
export function getPopupContainer(node?: HTMLElement): HTMLElement {
  return (node?.parentNode as HTMLElement) ?? document.body
}

/**
 * Add the object as a parameter to the URL
 * @param baseUrl url
 * @param obj
 * @returns {string}
 * eg:
 *  let obj = {a: '3', b: '4'}
 *  setObjToUrlParams('www.baidu.com', obj)
 *  ==>www.baidu.com?a=3&b=4
 */
export function setObjToUrlParams(baseUrl: string, obj: any): string {
  let parameters = ''
  for (const key in obj)
    parameters += `${key}=${encodeURIComponent(obj[key])}&`

  parameters = parameters.replace(/&$/, '')
  return /\?$/.test(baseUrl) ? baseUrl + parameters : baseUrl.replace(/\/?$/, '?') + parameters
}

/**
 * Recursively merge two objects.
 * 递归合并两个对象。
 *
 * @param source The source object to merge from. 要合并的源对象。
 * @param target The target object to merge into. 目标对象，合并后结果存放于此。
 * @param mergeArrays How to merge arrays. Default is "replace".
 *        如何合并数组。默认为replace。
 *        - "union": Union the arrays. 对数组执行并集操作。
 *        - "intersection": Intersect the arrays. 对数组执行交集操作。
 *        - "concat": Concatenate the arrays. 连接数组。
 *        - "replace": Replace the source array with the target array. 用目标数组替换源数组。
 * @returns The merged object. 合并后的对象。
 */
export function deepMerge<T extends object | null | undefined, U extends object | null | undefined>(
  source: T,
  target: U,
  mergeArrays: 'union' | 'intersection' | 'concat' | 'replace' = 'replace',
): T & U {
  if (!target)
    return source as T & U

  if (!source)
    return target as T & U

  return mergeWith({}, source, target, (sourceValue, targetValue) => {
    if (isArray(targetValue) && isArray(sourceValue)) {
      switch (mergeArrays) {
        case 'union':
          return unionWith(sourceValue, targetValue, isEqual)
        case 'intersection':
          return intersectionWith(sourceValue, targetValue, isEqual)
        case 'concat':
          return sourceValue.concat(targetValue)
        case 'replace':
          return targetValue
        default:
          throw new Error(`Unknown merge array strategy: ${mergeArrays as string}`)
      }
    }
    if (isObject(targetValue) && isObject(sourceValue))
      return deepMerge(sourceValue, targetValue, mergeArrays)

    return undefined
  })
}

export function openWindow(
  url: string,
  opt?: { target?: TargetContext | string; noopener?: boolean; noreferrer?: boolean },
) {
  const { target = '__blank', noopener = true, noreferrer = true } = opt || {}
  const feature: string[] = []

  noopener && feature.push('noopener=yes')
  noreferrer && feature.push('noreferrer=yes')

  window.open(url, target, feature.join(','))
}

// dynamic use hook props
export function getDynamicProps<T extends Record<string, unknown>, U>(props: T): Partial<U> {
  const ret: Recordable = {}

  // eslint-disable-next-line array-callback-return
  Object.keys(props).map((key) => {
    ret[key] = unref((props as Recordable)[key])
  })

  return ret as Partial<U>
}

export function getRawRoute(route: RouteLocationNormalized): RouteLocationNormalized {
  if (!route)
    return route
  const { matched, ...opt } = route
  return {
    ...opt,
    matched: (matched
      ? matched.map(item => ({
        meta: item.meta,
        name: item.name,
        path: item.path,
      }))
      : undefined) as RouteRecordNormalized[],
  }
}

// https://github.com/vant-ui/vant/issues/8302
interface EventShim {
  new (...args: any[]): {
    $props: {
      onClick?: (...args: any[]) => void
    }
  }
}

export type WithInstall<T> = T & {
  install(app: App): void
} & EventShim

export type CustomComponent = Component & { displayName?: string }

export function withInstall<T extends CustomComponent>(component: T, alias?: string) {
  (component as Record<string, unknown>).install = (app: App) => {
    const compName = component.name || component.displayName
    if (!compName)
      return
    app.component(compName, component)
    if (alias)
      app.config.globalProperties[alias] = component
  }
  return component as WithInstall<T>
}

/**
 * 简单实现防抖方法
 *
 * 防抖(debounce)函数在第一次触发给定的函数时，不立即执行函数，而是给出一个期限值(delay)，比如100ms。
 * 如果100ms内再次执行函数，就重新开始计时，直到计时结束后再真正执行函数。
 * 这样做的好处是如果短时间内大量触发同一事件，只会执行一次函数。
 *
 * @param fn 要防抖的函数
 * @param delay 防抖的毫秒数
 * @returns {Function} simpleDebounce
 */
export function simpleDebounce(fn, delay = 100) {
  let timer: any | null = null
  return () => {
    // eslint-disable-next-line prefer-rest-params
    const args = arguments
    if (timer)
      clearTimeout(timer)

    timer = setTimeout(() => {
      // eslint-disable-next-line ts/no-invalid-this
      fn.apply(this, args)
    }, delay)
  }
}

export function bindMethods<T extends object>(instance: T): void {
  const prototype = Object.getPrototypeOf(instance);
  const propertyNames = Object.getOwnPropertyNames(prototype);

  propertyNames.forEach((propertyName) => {
    const descriptor = Object.getOwnPropertyDescriptor(prototype, propertyName);
    const propertyValue = instance[propertyName as keyof T];

    if (
        typeof propertyValue === 'function' &&
        propertyName !== 'constructor' &&
        descriptor &&
        !descriptor.get &&
        !descriptor.set
    ) {
      instance[propertyName as keyof T] = propertyValue.bind(instance);
    }
  });
}

/**
 * 获取嵌套对象的字段值
 * @param obj - 要查找的对象
 * @param path - 用于查找字段的路径，使用小数点分隔
 * @returns 字段值，或者未找到时返回 undefined
 */
export function getNestedValue<T>(obj: T, path: string): any {
  if (typeof path !== 'string' || path.length === 0) {
    throw new Error('Path must be a non-empty string');
  }
  // 把路径字符串按 "." 分割成数组
  const keys = path.split('.') as (number | string)[];

  let current: any = obj;

  for (const key of keys) {
    if (current === null || current === undefined) {
      return undefined;
    }
    current = current[key as keyof typeof current];
  }

  return current;
}

/**
 * 获取链接的参数值（值类型）
 * @param key 参数键名
 * @param urlStr 链接地址，默认为当前浏览器的地址
 */
export function getUrlNumberValue(
    key: string,
    urlStr: string = location.href,
): number {
  return Number(getUrlValue(key, urlStr));
}

/**
 * 获取链接的参数值
 * @param key 参数键名
 * @param urlStr 链接地址，默认为当前浏览器的地址
 */
export function getUrlValue(
    key: string,
    urlStr: string = location.href,
): string {
  if (!urlStr || !key) return '';
  const url = new URL(decodeURIComponent(urlStr));
  return url.searchParams.get(key) ?? '';
}

/**
 * 将值复制到目标对象，且以目标对象属性为准，例：target: {a:1} source:{a:2,b:3} 结果为：{a:2}
 * @param target 目标对象
 * @param source 源对象
 */
export function copyValueToTarget(target: any, source: any) {
  const newObj = Object.assign({}, target, source);
  // 删除多余属性
  Object.keys(newObj).forEach((key) => {
    // 如果不是target中的属性则删除
    if (!Object.keys(target).includes(key)) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete newObj[key];
    }
  });
  // 更新目标对象值
  Object.assign(target, newObj);
}

/** 实现 groupBy 功能 */
export function groupBy(array: any[], key: string) {
  const result: Record<string, any[]> = {};
  for (const item of array) {
    const groupKey = item[key];
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
  }
  return result;
}

/**
 * 解析 JSON 字符串
 *
 * @param str
 */
export function jsonParse(str: string) {
  try {
    return JSON.parse(str);
  } catch {
    console.warn(`str[${str}] 不是一个 JSON 字符串`);
    return str;
  }
}

// 初始化 hexList
const hexList: string[] = [];
for (let i = 0; i <= 15; i++) {
  hexList[i] = i.toString(16);
}

export function buildUUID(): string {
  let uuid = '';
  for (let i = 1; i <= 36; i++) {
    switch (i) {
      case 9:
      case 14:
      case 19:
      case 24: {
        uuid += '-';
        break;
      }
      case 15: {
        uuid += 4;
        break;
      }
      case 20: {
        uuid += hexList[(Math.random() * 4) | 8];
        break;
      }
      default: {
        uuid += hexList[Math.trunc(Math.random() * 16)];
      }
    }
  }
  return uuid.replaceAll('-', '');
}
