import type { Locale } from 'ant-design-vue/es/locale';

import type { App } from 'vue';

import { ref } from 'vue';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import 'dayjs/locale/en';

import antdEnLocale from 'ant-design-vue/es/locale/en_US';
import antdZhLocale from 'ant-design-vue/es/locale/zh_CN';

import { useLocale } from '@/locales/useLocale';
import { createI18n } from 'vue-i18n';
import type { I18nOptions } from 'vue-i18n';

// 定义支持的语言类型
export type LocaleType = 'zh-CN' | 'en-US';

// 存储 antd 的 locale 配置
export const antdLocale = ref<Locale>(antdZhLocale);

// 动态导入语言文件
const modules = import.meta.glob('./langs/**/*.json', { eager: true });

// 加载本地语言包
function loadLocalMessages() {
  const messages: Record<string, any> = {};

  for (const path in modules) {
    const match = path.match(/\.\/langs\/([^/]+)\/(.*)\.json$/);
    if (match) {
      const locale = match[1];
      const module = match[2];
      const moduleName = module.replace(/\//g, '.');

      if (!messages[locale]) {
        messages[locale] = {};
      }

      const content = (modules[path] as any).default;

      if (moduleName.includes('.')) {
        // 处理嵌套结构
        const keys = moduleName.split('.');
        let current = messages[locale];
        for (let i = 0; i < keys.length - 1; i++) {
          if (!current[keys[i]]) {
            current[keys[i]] = {};
          }
          current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = content;
      } else {
        messages[locale][moduleName] = content;
      }
    }
  }

  return messages;
}

// 加载第三方库的语言包
async function loadThirdPartyLocale(locale: LocaleType) {
  await Promise.all([
    loadAntdLocale(locale),
    loadDayjsLocale(locale),
  ]);
}

// 加载 dayjs 语言包
async function loadDayjsLocale(locale: LocaleType) {
  try {
    switch (locale) {
      case 'en-US':
        dayjs.locale('en');
        break;
      case 'zh-CN':
        dayjs.locale('zh-cn');
        break;
      default:
        dayjs.locale('en');
    }
  } catch (error) {
    console.error(`Failed to load dayjs locale for ${locale}:`, error);
  }
}

// 加载 antd 语言包
async function loadAntdLocale(locale: LocaleType) {
  switch (locale) {
    case 'en-US':
      antdLocale.value = antdEnLocale;
      break;
    case 'zh-CN':
      antdLocale.value = antdZhLocale;
      break;
    default:
      antdLocale.value = antdEnLocale;
  }
}

// 创建 i18n 实例
function createI18nOptions(): I18nOptions {
  const localMessages = loadLocalMessages();

  return {
    legacy: false, // 使用 Composition API
    locale: 'zh-CN', // 默认语言
    fallbackLocale: 'en-US', // 回退语言
    messages: localMessages,
    silentTranslationWarn: import.meta.env.PROD, // 生产环境关闭警告
    missingWarn: !import.meta.env.PROD,
    fallbackWarn: !import.meta.env.PROD,
  };
}

// 导出 i18n 实例
export const i18n = createI18n(createI18nOptions());

// 设置 i18n
export async function setupI18n(app: App) {
  app.use(i18n);

  // 设置初始语言
  const { getLocale } = useLocale();
  const locale = getLocale();

  // 加载第三方库语言包
  await loadThirdPartyLocale(locale as LocaleType);

  // 设置 i18n 语言
  i18n.global.locale.value = locale;

  return i18n;
}

// 导出 useI18n 钩子
export function useI18n() {
  const { t, ...rest } = useI18n();
  return {
    t: (key: string, params?: any) => t(key, params),
    ...rest,
  };
}

// 简写 $t 函数
export const $t = i18n.global.t;

// 导出语言切换相关函数
export * from '@/locales/useLocale';