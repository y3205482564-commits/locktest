// vite.config.ts
import path4 from "node:path";
import process4 from "node:process";
import Uni from "file:///D:/idea/locktest/yudao-ui-admin-uniapp-master/node_modules/.pnpm/@uni-helper+plugin-uni@0.1._7dd855f7759871ea499894e325a48844/node_modules/@uni-helper/plugin-uni/src/index.js";
import Components from "file:///D:/idea/locktest/yudao-ui-admin-uniapp-master/node_modules/.pnpm/@uni-helper+vite-plugin-uni-components@0.2.3_rollup@4.50.0/node_modules/@uni-helper/vite-plugin-uni-components/dist/index.mjs";
import { WotResolver } from "file:///D:/idea/locktest/yudao-ui-admin-uniapp-master/node_modules/.pnpm/@uni-helper+vite-plugin-uni-components@0.2.3_rollup@4.50.0/node_modules/@uni-helper/vite-plugin-uni-components/dist/resolvers.mjs";
import UniLayouts from "file:///D:/idea/locktest/yudao-ui-admin-uniapp-master/node_modules/.pnpm/@uni-helper+vite-plugin-uni-layouts@0.1.11_rollup@4.50.0/node_modules/@uni-helper/vite-plugin-uni-layouts/dist/index.mjs";
import UniManifest from "file:///D:/idea/locktest/yudao-ui-admin-uniapp-master/node_modules/.pnpm/@uni-helper+vite-plugin-uni_3029bec0b3d08e60db5980c3b3917b41/node_modules/@uni-helper/vite-plugin-uni-manifest/dist/index.mjs";
import UniPages from "file:///D:/idea/locktest/yudao-ui-admin-uniapp-master/node_modules/.pnpm/@uni-helper+vite-plugin-uni_e52ea90dc678554206499b68a7e7c4f5/node_modules/@uni-helper/vite-plugin-uni-pages/dist/index.mjs";
import UniPlatform from "file:///D:/idea/locktest/yudao-ui-admin-uniapp-master/node_modules/.pnpm/@uni-helper+vite-plugin-uni-platform@0.0.5/node_modules/@uni-helper/vite-plugin-uni-platform/dist/index.mjs";
import Optimization from "file:///D:/idea/locktest/yudao-ui-admin-uniapp-master/node_modules/.pnpm/@uni-ku+bundle-optimizer@1._a004a359536f72272540b9546323719c/node_modules/@uni-ku/bundle-optimizer/dist/index.mjs";
import UniKuRoot from "file:///D:/idea/locktest/yudao-ui-admin-uniapp-master/node_modules/.pnpm/@uni-ku+root@1.4.1_vite@5.2_c0ded3f42c86f74e44565dc29de27a4c/node_modules/@uni-ku/root/dist/index.mjs";
import dayjs from "file:///D:/idea/locktest/yudao-ui-admin-uniapp-master/node_modules/.pnpm/dayjs@1.11.10/node_modules/dayjs/dayjs.min.js";
import { visualizer } from "file:///D:/idea/locktest/yudao-ui-admin-uniapp-master/node_modules/.pnpm/rollup-plugin-visualizer@6.0.3_rollup@4.50.0/node_modules/rollup-plugin-visualizer/dist/plugin/index.js";
import UnoCSS from "file:///D:/idea/locktest/yudao-ui-admin-uniapp-master/node_modules/.pnpm/unocss@66.0.0_postcss@8.5.6_2ea57284233e93f4ec422395ed46624f/node_modules/unocss/dist/vite.mjs";
import AutoImport from "file:///D:/idea/locktest/yudao-ui-admin-uniapp-master/node_modules/.pnpm/unplugin-auto-import@20.1.0_2c3564e8ad8f2187b112469e0f587db3/node_modules/unplugin-auto-import/dist/vite.js";
import { defineConfig, loadEnv } from "file:///D:/idea/locktest/yudao-ui-admin-uniapp-master/node_modules/.pnpm/vite@5.2.8_@types+node@20.19.11_sass@1.77.8_terser@5.43.1/node_modules/vite/dist/node/index.js";
import ViteRestart from "file:///D:/idea/locktest/yudao-ui-admin-uniapp-master/node_modules/.pnpm/vite-plugin-restart@1.0.0_v_0b7ac2f9a82bf6364aa0d69f22d0869d/node_modules/vite-plugin-restart/dist/index.js";

// scripts/open-dev-tools.js
import { exec } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
function _openDevTools() {
  const platform = process.platform;
  const { UNI_PLATFORM } = process.env;
  const uniPlatformText = UNI_PLATFORM === "mp-weixin" ? "\u5FAE\u4FE1\u5C0F\u7A0B\u5E8F" : UNI_PLATFORM === "mp-alipay" ? "\u652F\u4ED8\u5B9D\u5C0F\u7A0B\u5E8F" : "\u5C0F\u7A0B\u5E8F";
  const projectPath = path.resolve(process.cwd(), `dist/dev/${UNI_PLATFORM}`);
  if (!fs.existsSync(projectPath)) {
    console.log(`\u274C ${uniPlatformText}\u6784\u5EFA\u76EE\u5F55\u4E0D\u5B58\u5728:`, projectPath);
    return;
  }
  console.log(`\u{1F680} \u6B63\u5728\u6253\u5F00${uniPlatformText}\u5F00\u53D1\u8005\u5DE5\u5177...`);
  let command = "";
  if (platform === "darwin") {
    if (UNI_PLATFORM === "mp-weixin") {
      command = `/Applications/wechatwebdevtools.app/Contents/MacOS/cli -o "${projectPath}"`;
    } else if (UNI_PLATFORM === "mp-alipay") {
      command = `/Applications/\u5C0F\u7A0B\u5E8F\u5F00\u53D1\u8005\u5DE5\u5177.app/Contents/MacOS/\u5C0F\u7A0B\u5E8F\u5F00\u53D1\u8005\u5DE5\u5177 --p "${projectPath}"`;
    }
  } else if (platform === "win32" || platform === "win64") {
    if (UNI_PLATFORM === "mp-weixin") {
      command = `"C:\\Program Files (x86)\\Tencent\\\u5FAE\u4FE1web\u5F00\u53D1\u8005\u5DE5\u5177\\cli.bat" -o "${projectPath}"`;
    }
  } else {
    console.log("\u274C \u5F53\u524D\u7CFB\u7EDF\u4E0D\u652F\u6301\u81EA\u52A8\u6253\u5F00\u5FAE\u4FE1\u5F00\u53D1\u8005\u5DE5\u5177");
    return;
  }
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.log(`\u274C \u6253\u5F00${uniPlatformText}\u5F00\u53D1\u8005\u5DE5\u5177\u5931\u8D25:`, error.message);
      console.log(`\u{1F4A1} \u8BF7\u786E\u4FDD${uniPlatformText}\u5F00\u53D1\u8005\u5DE5\u5177\u670D\u52A1\u7AEF\u53E3\u5DF2\u542F\u7528`);
      console.log(`\u{1F4A1} \u53EF\u4EE5\u624B\u52A8\u6253\u5F00${uniPlatformText}\u5F00\u53D1\u8005\u5DE5\u5177\u5E76\u5BFC\u5165\u9879\u76EE:`, projectPath);
      return;
    }
    if (stderr) {
      console.log("\u26A0\uFE0F \u8B66\u544A:", stderr);
    }
    console.log(`\u2705 ${uniPlatformText}\u5F00\u53D1\u8005\u5DE5\u5177\u5DF2\u6253\u5F00`);
    if (stdout) {
      console.log(stdout);
    }
  });
}
function openDevTools() {
  let isFirstBuild = true;
  return {
    name: "uni-devtools",
    writeBundle() {
      if (isFirstBuild && process.env.UNI_PLATFORM?.includes("mp")) {
        isFirstBuild = false;
        _openDevTools();
      }
    }
  };
}

// vite-plugins/copy-native-resources.ts
import path2 from "node:path";
import process2 from "node:process";
import fs2 from "file:///D:/idea/locktest/yudao-ui-admin-uniapp-master/node_modules/.pnpm/fs-extra@10.1.0/node_modules/fs-extra/lib/index.js";
var DEFAULT_OPTIONS = {
  enable: true,
  sourceDir: "nativeplugins",
  targetDirName: "nativeplugins",
  verbose: true,
  logPrefix: "[copy-native-resources]"
};
function copyNativeResources(options = {}) {
  const config = { ...DEFAULT_OPTIONS, ...options };
  if (!config.enable) {
    return {
      name: "copy-native-resources-disabled",
      apply: "build",
      writeBundle() {
      }
    };
  }
  return {
    name: "copy-native-resources",
    apply: "build",
    // 只在构建时应用
    enforce: "post",
    // 在其他插件执行完毕后执行
    async writeBundle() {
      const { sourceDir, targetDirName, verbose, logPrefix } = config;
      try {
        const projectRoot = process2.cwd();
        const sourcePath = path2.resolve(projectRoot, sourceDir);
        const buildMode = process2.env.NODE_ENV === "production" ? "build" : "dev";
        const platform = process2.env.UNI_PLATFORM || "app";
        const targetPath = path2.resolve(
          projectRoot,
          "dist",
          buildMode,
          platform,
          targetDirName
        );
        const sourceExists = await fs2.pathExists(sourcePath);
        if (!sourceExists) {
          if (verbose) {
            console.warn(`${logPrefix} \u6E90\u76EE\u5F55\u4E0D\u5B58\u5728\uFF0C\u8DF3\u8FC7\u590D\u5236\u64CD\u4F5C`);
            console.warn(`${logPrefix} \u6E90\u76EE\u5F55\u8DEF\u5F84: ${sourcePath}`);
            console.warn(`${logPrefix} \u5982\u9700\u4F7F\u7528\u672C\u5730\u539F\u751F\u63D2\u4EF6\uFF0C\u8BF7\u5728\u9879\u76EE\u6839\u76EE\u5F55\u521B\u5EFA nativeplugins \u76EE\u5F55`);
            console.warn(`${logPrefix} \u5E76\u6309\u7167\u5B98\u65B9\u6587\u6863\u653E\u5165\u539F\u751F\u63D2\u4EF6\u6587\u4EF6`);
            console.warn(`${logPrefix} \u53C2\u8003: https://uniapp.dcloud.net.cn/plugin/native-plugin.html`);
          }
          return;
        }
        const sourceFiles = await fs2.readdir(sourcePath);
        if (sourceFiles.length === 0) {
          if (verbose) {
            console.warn(`${logPrefix} \u6E90\u76EE\u5F55\u4E3A\u7A7A\uFF0C\u8DF3\u8FC7\u590D\u5236\u64CD\u4F5C`);
            console.warn(`${logPrefix} \u6E90\u76EE\u5F55\u8DEF\u5F84: ${sourcePath}`);
            console.warn(`${logPrefix} \u8BF7\u5728 nativeplugins \u76EE\u5F55\u4E2D\u653E\u5165\u539F\u751F\u63D2\u4EF6\u6587\u4EF6`);
          }
          return;
        }
        await fs2.ensureDir(targetPath);
        if (verbose) {
          console.log(`${logPrefix} \u5F00\u59CB\u590D\u5236 UniApp \u672C\u5730\u539F\u751F\u63D2\u4EF6...`);
          console.log(`${logPrefix} \u6E90\u76EE\u5F55: ${sourcePath}`);
          console.log(`${logPrefix} \u76EE\u6807\u76EE\u5F55: ${targetPath}`);
          console.log(`${logPrefix} \u6784\u5EFA\u6A21\u5F0F: ${buildMode}`);
          console.log(`${logPrefix} \u76EE\u6807\u5E73\u53F0: ${platform}`);
          console.log(`${logPrefix} \u53D1\u73B0 ${sourceFiles.length} \u4E2A\u539F\u751F\u63D2\u4EF6\u6587\u4EF6/\u76EE\u5F55`);
        }
        await fs2.copy(sourcePath, targetPath, {
          overwrite: true,
          // 覆盖已存在的文件，确保使用最新版本
          errorOnExist: false,
          // 如果目标文件存在不报错
          preserveTimestamps: true
          // 保持文件的时间戳
        });
        if (verbose) {
          console.log(`${logPrefix} \u2705 UniApp \u672C\u5730\u539F\u751F\u63D2\u4EF6\u590D\u5236\u5B8C\u6210`);
          console.log(`${logPrefix} \u5DF2\u6210\u529F\u590D\u5236 ${sourceFiles.length} \u4E2A\u6587\u4EF6/\u76EE\u5F55\u5230\u6784\u5EFA\u76EE\u5F55`);
          console.log(`${logPrefix} \u539F\u751F\u63D2\u4EF6\u73B0\u5728\u53EF\u4EE5\u5728 App \u4E2D\u6B63\u5E38\u4F7F\u7528`);
        }
      } catch (error) {
        console.error(`${config.logPrefix} \u274C \u590D\u5236 UniApp \u672C\u5730\u539F\u751F\u63D2\u4EF6\u5931\u8D25:`, error);
        console.error(`${config.logPrefix} \u9519\u8BEF\u8BE6\u60C5:`, error instanceof Error ? error.message : String(error));
        console.error(`${config.logPrefix} \u8BF7\u68C0\u67E5\u6E90\u76EE\u5F55\u6743\u9650\u548C\u78C1\u76D8\u7A7A\u95F4`);
      }
    }
  };
}
function createCopyNativeResourcesPlugin(enable = true, options = {}) {
  return copyNativeResources({ enable, ...options });
}

// vite-plugins/sync-manifest-plugins.ts
import fs3 from "node:fs";
import path3 from "node:path";
import process3 from "node:process";
function syncManifestPlugin() {
  return {
    name: "sync-manifest",
    apply: "build",
    enforce: "post",
    writeBundle: {
      order: "post",
      handler() {
        const srcManifestPath = path3.resolve(process3.cwd(), "./src/manifest.json");
        const distAppPath = path3.resolve(process3.cwd(), "./dist/dev/app/manifest.json");
        try {
          const srcManifest = JSON.parse(fs3.readFileSync(srcManifestPath, "utf8"));
          const distAppDir = path3.dirname(distAppPath);
          if (!fs3.existsSync(distAppDir)) {
            fs3.mkdirSync(distAppDir, { recursive: true });
          }
          let distManifest = {};
          if (fs3.existsSync(distAppPath)) {
            distManifest = JSON.parse(fs3.readFileSync(distAppPath, "utf8"));
          }
          if (srcManifest["app-plus"]?.distribute?.plugins) {
            if (!distManifest.plus)
              distManifest.plus = {};
            if (!distManifest.plus.distribute)
              distManifest.plus.distribute = {};
            distManifest.plus.distribute.plugins = srcManifest["app-plus"].distribute.plugins;
            fs3.writeFileSync(distAppPath, JSON.stringify(distManifest, null, 2));
            console.log("\u2705 Manifest plugins \u540C\u6B65\u6210\u529F");
          }
        } catch (error) {
          console.error("\u274C \u540C\u6B65 manifest plugins \u5931\u8D25:", error);
        }
      }
    }
  };
}

// vite.config.ts
var vite_config_default = defineConfig(({ command, mode }) => {
  console.log("command, mode -> ", command, mode);
  const { UNI_PLATFORM } = process4.env;
  console.log("UNI_PLATFORM -> ", UNI_PLATFORM);
  const env = loadEnv(mode, path4.resolve(process4.cwd(), "env"));
  const {
    VITE_APP_PORT,
    VITE_SERVER_BASEURL,
    VITE_APP_TITLE,
    VITE_DELETE_CONSOLE,
    VITE_APP_PUBLIC_BASE,
    VITE_APP_PROXY_ENABLE,
    VITE_APP_PROXY_PREFIX,
    VITE_COPY_NATIVE_RES_ENABLE
  } = env;
  console.log("\u73AF\u5883\u53D8\u91CF env -> ", env);
  return defineConfig({
    envDir: "./env",
    // 自定义env目录
    base: VITE_APP_PUBLIC_BASE,
    plugins: [
      UniLayouts(),
      UniPlatform(),
      UniManifest(),
      UniPages({
        exclude: ["**/components/**/**.*"],
        // pages 目录为 src/pages，分包目录不能配置在pages目录下！！
        // 是个数组，可以配置多个，但是不能为pages里面的目录！！
        subPackages: [
          "src/pages-core",
          // 这个是相对必要的路由，尽量留着（登录页、注册页、404页等）
          "src/pages-system",
          // “系统管理”模块
          "src/pages-infra",
          // “基础设施”模块
          "src/pages-bpm",
          // “工作流程”模块
          "src/pages-lock"
          // “智能锁”模块
        ],
        dts: "src/types/uni-pages.d.ts"
      }),
      // Optimization 插件需要 page.json 文件，故应在 UniPages 插件之后执行
      Optimization({
        enable: {
          "optimization": true,
          "async-import": true,
          "async-component": true
        },
        dts: {
          base: "src/types"
        },
        logger: false
      }),
      // UniXXX 需要在 Uni 之前引入
      // 若存在改变 pages.json 的插件，请将 UniKuRoot 放置其后
      UniKuRoot({
        excludePages: ["**/components/**/**.*"]
      }),
      // Components 需要在 Uni 之前引入
      Components({
        extensions: ["vue"],
        deep: true,
        // 是否递归扫描子目录，
        directoryAsNamespace: false,
        // 是否把目录名作为命名空间前缀，true 时组件名为 目录名+组件名，
        dts: "src/types/components.d.ts"
        // 自动生成的组件类型声明文件路径（用于 TypeScript 支持）
      }),
      Uni(),
      {
        // 临时解决 dcloudio 官方的 @dcloudio/uni-mp-compiler 出现的编译 BUG
        // 参考 github issue: https://github.com/dcloudio/uni-app/issues/4952
        // 自定义插件禁用 vite:vue 插件的 devToolsEnabled，强制编译 vue 模板时 inline 为 true
        name: "fix-vite-plugin-vue",
        configResolved(config) {
          const plugin = config.plugins.find((p) => p.name === "vite:vue");
          if (plugin && plugin.api && plugin.api.options) {
            plugin.api.options.devToolsEnabled = false;
          }
        }
      },
      UnoCSS(),
      AutoImport({
        imports: ["vue", "uni-app"],
        dts: "src/types/auto-import.d.ts",
        dirs: ["src/hooks"],
        // 自动导入 hooks
        vueTemplate: true
        // default false
      }),
      ViteRestart({
        // 通过这个插件，在修改vite.config.js文件则不需要重新运行也生效配置
        restart: ["vite.config.js"]
      }),
      // h5环境增加 BUILD_TIME 和 BUILD_BRANCH
      UNI_PLATFORM === "h5" && {
        name: "html-transform",
        transformIndexHtml(html) {
          return html.replace("%BUILD_TIME%", dayjs().format("YYYY-MM-DD HH:mm:ss")).replace("%VITE_APP_TITLE%", VITE_APP_TITLE);
        }
      },
      // 打包分析插件，h5 + 生产环境才弹出
      UNI_PLATFORM === "h5" && mode === "production" && visualizer({
        filename: "./node_modules/.cache/visualizer/stats.html",
        open: true,
        gzipSize: true,
        brotliSize: true
      }),
      // 原生插件资源复制插件 - 仅在 app 平台且启用时生效
      createCopyNativeResourcesPlugin(
        UNI_PLATFORM === "app" && VITE_COPY_NATIVE_RES_ENABLE === "true",
        {
          verbose: mode === "development"
          // 开发模式显示详细日志
        }
      ),
      syncManifestPlugin(),
      Components({
        resolvers: [WotResolver()],
        extensions: ["vue"],
        deep: true,
        // 是否递归扫描子目录，
        directoryAsNamespace: false,
        // 是否把目录名作为命名空间前缀，true 时组件名为 目录名+组件名，
        dts: "src/types/components.d.ts"
        // 自动生成的组件类型声明文件路径（用于 TypeScript 支持）
      }),
      // 自动打开开发者工具插件 (必须修改 .env 文件中的 VITE_WX_APPID)
      openDevTools()
    ],
    define: {
      __VITE_APP_PROXY__: JSON.stringify(VITE_APP_PROXY_ENABLE)
    },
    css: {
      postcss: {
        plugins: [
          // autoprefixer({
          //   // 指定目标浏览器
          //   overrideBrowserslist: ['> 1%', 'last 2 versions'],
          // }),
        ]
      }
    },
    resolve: {
      alias: {
        "@": path4.join(process4.cwd(), "./src"),
        "@img": path4.join(process4.cwd(), "./src/static/images")
      }
    },
    server: {
      host: "0.0.0.0",
      hmr: true,
      port: Number.parseInt(VITE_APP_PORT, 10),
      // 仅 H5 端生效，其他端不生效（其他端走build，不走devServer)
      proxy: JSON.parse(VITE_APP_PROXY_ENABLE) ? {
        [VITE_APP_PROXY_PREFIX]: {
          target: VITE_SERVER_BASEURL,
          changeOrigin: true,
          // 后端有/api前缀则不做处理，没有则需要去掉
          rewrite: (path5) => path5.replace(new RegExp(`^${VITE_APP_PROXY_PREFIX}`), "")
        }
      } : void 0
    },
    esbuild: {
      drop: VITE_DELETE_CONSOLE === "true" ? ["console", "debugger"] : []
    },
    build: {
      sourcemap: false,
      // 方便非h5端调试
      // sourcemap: VITE_SHOW_SOURCEMAP === 'true', // 默认是false
      target: "es6",
      // 开发环境不用压缩
      minify: mode === "development" ? false : "esbuild"
    }
  });
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAic2NyaXB0cy9vcGVuLWRldi10b29scy5qcyIsICJ2aXRlLXBsdWdpbnMvY29weS1uYXRpdmUtcmVzb3VyY2VzLnRzIiwgInZpdGUtcGx1Z2lucy9zeW5jLW1hbmlmZXN0LXBsdWdpbnMudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxpZGVhXFxcXGxvY2t0ZXN0XFxcXHl1ZGFvLXVpLWFkbWluLXVuaWFwcC1tYXN0ZXJcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXGlkZWFcXFxcbG9ja3Rlc3RcXFxceXVkYW8tdWktYWRtaW4tdW5pYXBwLW1hc3RlclxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovaWRlYS9sb2NrdGVzdC95dWRhby11aS1hZG1pbi11bmlhcHAtbWFzdGVyL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHBhdGggZnJvbSAnbm9kZTpwYXRoJ1xuaW1wb3J0IHByb2Nlc3MgZnJvbSAnbm9kZTpwcm9jZXNzJ1xuaW1wb3J0IFVuaSBmcm9tICdAdW5pLWhlbHBlci9wbHVnaW4tdW5pJ1xuaW1wb3J0IENvbXBvbmVudHMgZnJvbSAnQHVuaS1oZWxwZXIvdml0ZS1wbHVnaW4tdW5pLWNvbXBvbmVudHMnXG5pbXBvcnQgeyBXb3RSZXNvbHZlciB9IGZyb20gJ0B1bmktaGVscGVyL3ZpdGUtcGx1Z2luLXVuaS1jb21wb25lbnRzL3Jlc29sdmVycydcbi8vIEBzZWUgaHR0cHM6Ly91bmktaGVscGVyLmpzLm9yZy92aXRlLXBsdWdpbi11bmktbGF5b3V0c1xuaW1wb3J0IFVuaUxheW91dHMgZnJvbSAnQHVuaS1oZWxwZXIvdml0ZS1wbHVnaW4tdW5pLWxheW91dHMnXG4vLyBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS91bmktaGVscGVyL3ZpdGUtcGx1Z2luLXVuaS1tYW5pZmVzdFxuaW1wb3J0IFVuaU1hbmlmZXN0IGZyb20gJ0B1bmktaGVscGVyL3ZpdGUtcGx1Z2luLXVuaS1tYW5pZmVzdCdcbi8vIEBzZWUgaHR0cHM6Ly91bmktaGVscGVyLmpzLm9yZy92aXRlLXBsdWdpbi11bmktcGFnZXNcbmltcG9ydCBVbmlQYWdlcyBmcm9tICdAdW5pLWhlbHBlci92aXRlLXBsdWdpbi11bmktcGFnZXMnXG4vLyBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS91bmktaGVscGVyL3ZpdGUtcGx1Z2luLXVuaS1wbGF0Zm9ybVxuLy8gXHU5NzAwXHU4OTgxXHU0RTBFIEB1bmktaGVscGVyL3ZpdGUtcGx1Z2luLXVuaS1wYWdlcyBcdTYzRDJcdTRFRjZcdTRFMDBcdThENzdcdTRGN0ZcdTc1MjhcbmltcG9ydCBVbmlQbGF0Zm9ybSBmcm9tICdAdW5pLWhlbHBlci92aXRlLXBsdWdpbi11bmktcGxhdGZvcm0nXG4vKipcbiAqIFx1NTIwNlx1NTMwNVx1NEYxOFx1NTMxNlx1MzAwMVx1NkEyMVx1NTc1N1x1NUYwMlx1NkI2NVx1OERFOFx1NTMwNVx1OEMwM1x1NzUyOFx1MzAwMVx1N0VDNFx1NEVGNlx1NUYwMlx1NkI2NVx1OERFOFx1NTMwNVx1NUYxNVx1NzUyOFxuICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vdW5pLWt1L2J1bmRsZS1vcHRpbWl6ZXJcbiAqL1xuaW1wb3J0IE9wdGltaXphdGlvbiBmcm9tICdAdW5pLWt1L2J1bmRsZS1vcHRpbWl6ZXInXG4vLyBodHRwczovL2dpdGh1Yi5jb20vdW5pLWt1L3Jvb3RcbmltcG9ydCBVbmlLdVJvb3QgZnJvbSAnQHVuaS1rdS9yb290J1xuaW1wb3J0IGRheWpzIGZyb20gJ2RheWpzJ1xuaW1wb3J0IHsgdmlzdWFsaXplciB9IGZyb20gJ3JvbGx1cC1wbHVnaW4tdmlzdWFsaXplcidcbmltcG9ydCBVbm9DU1MgZnJvbSAndW5vY3NzL3ZpdGUnXG5pbXBvcnQgQXV0b0ltcG9ydCBmcm9tICd1bnBsdWdpbi1hdXRvLWltcG9ydC92aXRlJ1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnLCBsb2FkRW52IH0gZnJvbSAndml0ZSdcbmltcG9ydCBWaXRlUmVzdGFydCBmcm9tICd2aXRlLXBsdWdpbi1yZXN0YXJ0J1xuaW1wb3J0IG9wZW5EZXZUb29scyBmcm9tICcuL3NjcmlwdHMvb3Blbi1kZXYtdG9vbHMnXG5pbXBvcnQgeyBjcmVhdGVDb3B5TmF0aXZlUmVzb3VyY2VzUGx1Z2luIH0gZnJvbSAnLi92aXRlLXBsdWdpbnMvY29weS1uYXRpdmUtcmVzb3VyY2VzJ1xuaW1wb3J0IHN5bmNNYW5pZmVzdFBsdWdpbiBmcm9tICcuL3ZpdGUtcGx1Z2lucy9zeW5jLW1hbmlmZXN0LXBsdWdpbnMnXG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKHsgY29tbWFuZCwgbW9kZSB9KSA9PiB7XG4gIC8vIEBzZWUgaHR0cHM6Ly91bm9jc3MuZGV2L1xuICAvLyBjb25zdCBVbm9DU1MgPSAoYXdhaXQgaW1wb3J0KCd1bm9jc3Mvdml0ZScpKS5kZWZhdWx0XG4gIC8vIGNvbnNvbGUubG9nKG1vZGUgPT09IHByb2Nlc3MuZW52Lk5PREVfRU5WKSAvLyB0cnVlXG5cbiAgLy8gbW9kZTogXHU1MzNBXHU1MjA2XHU3NTFGXHU0RUE3XHU3M0FGXHU1ODgzXHU4RkQ4XHU2NjJGXHU1RjAwXHU1M0QxXHU3M0FGXHU1ODgzXG4gIGNvbnNvbGUubG9nKCdjb21tYW5kLCBtb2RlIC0+ICcsIGNvbW1hbmQsIG1vZGUpXG4gIC8vIHBucG0gZGV2Omg1IFx1NjVGNlx1NUY5N1x1NTIzMCA9PiBzZXJ2ZSBkZXZlbG9wbWVudFxuICAvLyBwbnBtIGJ1aWxkOmg1IFx1NjVGNlx1NUY5N1x1NTIzMCA9PiBidWlsZCBwcm9kdWN0aW9uXG4gIC8vIHBucG0gZGV2Om1wLXdlaXhpbiBcdTY1RjZcdTVGOTdcdTUyMzAgPT4gYnVpbGQgZGV2ZWxvcG1lbnQgKFx1NkNFOFx1NjEwRlx1NTMzQVx1NTIyQlx1RkYwQ2NvbW1hbmRcdTRFM0FidWlsZClcbiAgLy8gcG5wbSBidWlsZDptcC13ZWl4aW4gXHU2NUY2XHU1Rjk3XHU1MjMwID0+IGJ1aWxkIHByb2R1Y3Rpb25cbiAgLy8gcG5wbSBkZXY6YXBwIFx1NjVGNlx1NUY5N1x1NTIzMCA9PiBidWlsZCBkZXZlbG9wbWVudCAoXHU2Q0U4XHU2MTBGXHU1MzNBXHU1MjJCXHVGRjBDY29tbWFuZFx1NEUzQWJ1aWxkKVxuICAvLyBwbnBtIGJ1aWxkOmFwcCBcdTY1RjZcdTVGOTdcdTUyMzAgPT4gYnVpbGQgcHJvZHVjdGlvblxuICAvLyBkZXYgXHU1NDhDIGJ1aWxkIFx1NTQ3RFx1NEVFNFx1NTNFRlx1NEVFNVx1NTIwNlx1NTIyQlx1NEY3Rlx1NzUyOCAuZW52LmRldmVsb3BtZW50IFx1NTQ4QyAuZW52LnByb2R1Y3Rpb24gXHU3Njg0XHU3M0FGXHU1ODgzXHU1M0Q4XHU5MUNGXG5cbiAgY29uc3QgeyBVTklfUExBVEZPUk0gfSA9IHByb2Nlc3MuZW52XG4gIGNvbnNvbGUubG9nKCdVTklfUExBVEZPUk0gLT4gJywgVU5JX1BMQVRGT1JNKSAvLyBcdTVGOTdcdTUyMzAgbXAtd2VpeGluLCBoNSwgYXBwIFx1N0I0OVxuXG4gIGNvbnN0IGVudiA9IGxvYWRFbnYobW9kZSwgcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksICdlbnYnKSlcbiAgY29uc3Qge1xuICAgIFZJVEVfQVBQX1BPUlQsXG4gICAgVklURV9TRVJWRVJfQkFTRVVSTCxcbiAgICBWSVRFX0FQUF9USVRMRSxcbiAgICBWSVRFX0RFTEVURV9DT05TT0xFLFxuICAgIFZJVEVfQVBQX1BVQkxJQ19CQVNFLFxuICAgIFZJVEVfQVBQX1BST1hZX0VOQUJMRSxcbiAgICBWSVRFX0FQUF9QUk9YWV9QUkVGSVgsXG4gICAgVklURV9DT1BZX05BVElWRV9SRVNfRU5BQkxFLFxuICB9ID0gZW52XG4gIGNvbnNvbGUubG9nKCdcdTczQUZcdTU4ODNcdTUzRDhcdTkxQ0YgZW52IC0+ICcsIGVudilcblxuICByZXR1cm4gZGVmaW5lQ29uZmlnKHtcbiAgICBlbnZEaXI6ICcuL2VudicsIC8vIFx1ODFFQVx1NUI5QVx1NEU0OWVudlx1NzZFRVx1NUY1NVxuICAgIGJhc2U6IFZJVEVfQVBQX1BVQkxJQ19CQVNFLFxuICAgIHBsdWdpbnM6IFtcbiAgICAgIFVuaUxheW91dHMoKSxcbiAgICAgIFVuaVBsYXRmb3JtKCksXG4gICAgICBVbmlNYW5pZmVzdCgpLFxuICAgICAgVW5pUGFnZXMoe1xuICAgICAgICBleGNsdWRlOiBbJyoqL2NvbXBvbmVudHMvKiovKiouKiddLFxuICAgICAgICAvLyBwYWdlcyBcdTc2RUVcdTVGNTVcdTRFM0Egc3JjL3BhZ2VzXHVGRjBDXHU1MjA2XHU1MzA1XHU3NkVFXHU1RjU1XHU0RTBEXHU4MEZEXHU5MTREXHU3RjZFXHU1NzI4cGFnZXNcdTc2RUVcdTVGNTVcdTRFMEJcdUZGMDFcdUZGMDFcbiAgICAgICAgLy8gXHU2NjJGXHU0RTJBXHU2NTcwXHU3RUM0XHVGRjBDXHU1M0VGXHU0RUU1XHU5MTREXHU3RjZFXHU1OTFBXHU0RTJBXHVGRjBDXHU0RjQ2XHU2NjJGXHU0RTBEXHU4MEZEXHU0RTNBcGFnZXNcdTkxQ0NcdTk3NjJcdTc2ODRcdTc2RUVcdTVGNTVcdUZGMDFcdUZGMDFcbiAgICAgICAgc3ViUGFja2FnZXM6IFtcbiAgICAgICAgICAnc3JjL3BhZ2VzLWNvcmUnLCAvLyBcdThGRDlcdTRFMkFcdTY2MkZcdTc2RjhcdTVCRjlcdTVGQzVcdTg5ODFcdTc2ODRcdThERUZcdTc1MzFcdUZGMENcdTVDM0RcdTkxQ0ZcdTc1NTlcdTc3NDBcdUZGMDhcdTc2N0JcdTVGNTVcdTk4NzVcdTMwMDFcdTZDRThcdTUxOENcdTk4NzVcdTMwMDE0MDRcdTk4NzVcdTdCNDlcdUZGMDlcbiAgICAgICAgICAnc3JjL3BhZ2VzLXN5c3RlbScsIC8vIFx1MjAxQ1x1N0NGQlx1N0VERlx1N0JBMVx1NzQwNlx1MjAxRFx1NkEyMVx1NTc1N1xuICAgICAgICAgICdzcmMvcGFnZXMtaW5mcmEnLCAvLyBcdTIwMUNcdTU3RkFcdTc4NDBcdThCQkVcdTY1QkRcdTIwMURcdTZBMjFcdTU3NTdcbiAgICAgICAgICAnc3JjL3BhZ2VzLWJwbScsIC8vIFx1MjAxQ1x1NURFNVx1NEY1Q1x1NkQ0MVx1N0EwQlx1MjAxRFx1NkEyMVx1NTc1N1xuICAgICAgICAgICdzcmMvcGFnZXMtbG9jaycsIC8vIFx1MjAxQ1x1NjY3QVx1ODBGRFx1OTUwMVx1MjAxRFx1NkEyMVx1NTc1N1xuICAgICAgICBdLFxuICAgICAgICBkdHM6ICdzcmMvdHlwZXMvdW5pLXBhZ2VzLmQudHMnLFxuICAgICAgfSksXG4gICAgICAvLyBPcHRpbWl6YXRpb24gXHU2M0QyXHU0RUY2XHU5NzAwXHU4OTgxIHBhZ2UuanNvbiBcdTY1ODdcdTRFRjZcdUZGMENcdTY1NDVcdTVFOTRcdTU3MjggVW5pUGFnZXMgXHU2M0QyXHU0RUY2XHU0RTRCXHU1NDBFXHU2MjY3XHU4ODRDXG4gICAgICBPcHRpbWl6YXRpb24oe1xuICAgICAgICBlbmFibGU6IHtcbiAgICAgICAgICAnb3B0aW1pemF0aW9uJzogdHJ1ZSxcbiAgICAgICAgICAnYXN5bmMtaW1wb3J0JzogdHJ1ZSxcbiAgICAgICAgICAnYXN5bmMtY29tcG9uZW50JzogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICAgICAgZHRzOiB7XG4gICAgICAgICAgYmFzZTogJ3NyYy90eXBlcycsXG4gICAgICAgIH0sXG4gICAgICAgIGxvZ2dlcjogZmFsc2UsXG4gICAgICB9KSxcbiAgICAgIC8vIFVuaVhYWCBcdTk3MDBcdTg5ODFcdTU3MjggVW5pIFx1NEU0Qlx1NTI0RFx1NUYxNVx1NTE2NVxuICAgICAgLy8gXHU4MkU1XHU1QjU4XHU1NzI4XHU2NTM5XHU1M0Q4IHBhZ2VzLmpzb24gXHU3Njg0XHU2M0QyXHU0RUY2XHVGRjBDXHU4QkY3XHU1QzA2IFVuaUt1Um9vdCBcdTY1M0VcdTdGNkVcdTUxNzZcdTU0MEVcbiAgICAgIFVuaUt1Um9vdCh7XG4gICAgICAgIGV4Y2x1ZGVQYWdlczogWycqKi9jb21wb25lbnRzLyoqLyoqLionXSxcbiAgICAgIH0pLFxuICAgICAgLy8gQ29tcG9uZW50cyBcdTk3MDBcdTg5ODFcdTU3MjggVW5pIFx1NEU0Qlx1NTI0RFx1NUYxNVx1NTE2NVxuICAgICAgQ29tcG9uZW50cyh7XG4gICAgICAgIGV4dGVuc2lvbnM6IFsndnVlJ10sXG4gICAgICAgIGRlZXA6IHRydWUsIC8vIFx1NjYyRlx1NTQyNlx1OTAxMlx1NUY1Mlx1NjI2Qlx1NjNDRlx1NUI1MFx1NzZFRVx1NUY1NVx1RkYwQ1xuICAgICAgICBkaXJlY3RvcnlBc05hbWVzcGFjZTogZmFsc2UsIC8vIFx1NjYyRlx1NTQyNlx1NjI4QVx1NzZFRVx1NUY1NVx1NTQwRFx1NEY1Q1x1NEUzQVx1NTQ3RFx1NTQwRFx1N0E3QVx1OTVGNFx1NTI0RFx1N0YwMFx1RkYwQ3RydWUgXHU2NUY2XHU3RUM0XHU0RUY2XHU1NDBEXHU0RTNBIFx1NzZFRVx1NUY1NVx1NTQwRCtcdTdFQzRcdTRFRjZcdTU0MERcdUZGMENcbiAgICAgICAgZHRzOiAnc3JjL3R5cGVzL2NvbXBvbmVudHMuZC50cycsIC8vIFx1ODFFQVx1NTJBOFx1NzUxRlx1NjIxMFx1NzY4NFx1N0VDNFx1NEVGNlx1N0M3Qlx1NTc4Qlx1NThGMFx1NjYwRVx1NjU4N1x1NEVGNlx1OERFRlx1NUY4NFx1RkYwOFx1NzUyOFx1NEU4RSBUeXBlU2NyaXB0IFx1NjUyRlx1NjMwMVx1RkYwOVxuICAgICAgfSksXG4gICAgICBVbmkoKSxcbiAgICAgIHtcbiAgICAgICAgLy8gXHU0RTM0XHU2NUY2XHU4OUUzXHU1MUIzIGRjbG91ZGlvIFx1NUI5OFx1NjVCOVx1NzY4NCBAZGNsb3VkaW8vdW5pLW1wLWNvbXBpbGVyIFx1NTFGQVx1NzNCMFx1NzY4NFx1N0YxNlx1OEJEMSBCVUdcbiAgICAgICAgLy8gXHU1M0MyXHU4MDAzIGdpdGh1YiBpc3N1ZTogaHR0cHM6Ly9naXRodWIuY29tL2RjbG91ZGlvL3VuaS1hcHAvaXNzdWVzLzQ5NTJcbiAgICAgICAgLy8gXHU4MUVBXHU1QjlBXHU0RTQ5XHU2M0QyXHU0RUY2XHU3OTgxXHU3NTI4IHZpdGU6dnVlIFx1NjNEMlx1NEVGNlx1NzY4NCBkZXZUb29sc0VuYWJsZWRcdUZGMENcdTVGM0FcdTUyMzZcdTdGMTZcdThCRDEgdnVlIFx1NkEyMVx1Njc3Rlx1NjVGNiBpbmxpbmUgXHU0RTNBIHRydWVcbiAgICAgICAgbmFtZTogJ2ZpeC12aXRlLXBsdWdpbi12dWUnLFxuICAgICAgICBjb25maWdSZXNvbHZlZChjb25maWcpIHtcbiAgICAgICAgICBjb25zdCBwbHVnaW4gPSBjb25maWcucGx1Z2lucy5maW5kKHAgPT4gcC5uYW1lID09PSAndml0ZTp2dWUnKVxuICAgICAgICAgIGlmIChwbHVnaW4gJiYgcGx1Z2luLmFwaSAmJiBwbHVnaW4uYXBpLm9wdGlvbnMpIHtcbiAgICAgICAgICAgIHBsdWdpbi5hcGkub3B0aW9ucy5kZXZUb29sc0VuYWJsZWQgPSBmYWxzZVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBVbm9DU1MoKSxcbiAgICAgIEF1dG9JbXBvcnQoe1xuICAgICAgICBpbXBvcnRzOiBbJ3Z1ZScsICd1bmktYXBwJ10sXG4gICAgICAgIGR0czogJ3NyYy90eXBlcy9hdXRvLWltcG9ydC5kLnRzJyxcbiAgICAgICAgZGlyczogWydzcmMvaG9va3MnXSwgLy8gXHU4MUVBXHU1MkE4XHU1QkZDXHU1MTY1IGhvb2tzXG4gICAgICAgIHZ1ZVRlbXBsYXRlOiB0cnVlLCAvLyBkZWZhdWx0IGZhbHNlXG4gICAgICB9KSxcbiAgICAgIFZpdGVSZXN0YXJ0KHtcbiAgICAgICAgLy8gXHU5MDFBXHU4RkM3XHU4RkQ5XHU0RTJBXHU2M0QyXHU0RUY2XHVGRjBDXHU1NzI4XHU0RkVFXHU2NTM5dml0ZS5jb25maWcuanNcdTY1ODdcdTRFRjZcdTUyMTlcdTRFMERcdTk3MDBcdTg5ODFcdTkxQ0RcdTY1QjBcdThGRDBcdTg4NENcdTRFNUZcdTc1MUZcdTY1NDhcdTkxNERcdTdGNkVcbiAgICAgICAgcmVzdGFydDogWyd2aXRlLmNvbmZpZy5qcyddLFxuICAgICAgfSksXG4gICAgICAvLyBoNVx1NzNBRlx1NTg4M1x1NTg5RVx1NTJBMCBCVUlMRF9USU1FIFx1NTQ4QyBCVUlMRF9CUkFOQ0hcbiAgICAgIFVOSV9QTEFURk9STSA9PT0gJ2g1JyAmJiB7XG4gICAgICAgIG5hbWU6ICdodG1sLXRyYW5zZm9ybScsXG4gICAgICAgIHRyYW5zZm9ybUluZGV4SHRtbChodG1sKSB7XG4gICAgICAgICAgcmV0dXJuIGh0bWwucmVwbGFjZSgnJUJVSUxEX1RJTUUlJywgZGF5anMoKS5mb3JtYXQoJ1lZWVktTU0tREQgSEg6bW06c3MnKSkucmVwbGFjZSgnJVZJVEVfQVBQX1RJVExFJScsIFZJVEVfQVBQX1RJVExFKVxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIC8vIFx1NjI1M1x1NTMwNVx1NTIwNlx1Njc5MFx1NjNEMlx1NEVGNlx1RkYwQ2g1ICsgXHU3NTFGXHU0RUE3XHU3M0FGXHU1ODgzXHU2MjREXHU1RjM5XHU1MUZBXG4gICAgICBVTklfUExBVEZPUk0gPT09ICdoNSdcbiAgICAgICYmIG1vZGUgPT09ICdwcm9kdWN0aW9uJ1xuICAgICAgJiYgdmlzdWFsaXplcih7XG4gICAgICAgIGZpbGVuYW1lOiAnLi9ub2RlX21vZHVsZXMvLmNhY2hlL3Zpc3VhbGl6ZXIvc3RhdHMuaHRtbCcsXG4gICAgICAgIG9wZW46IHRydWUsXG4gICAgICAgIGd6aXBTaXplOiB0cnVlLFxuICAgICAgICBicm90bGlTaXplOiB0cnVlLFxuICAgICAgfSksXG4gICAgICAvLyBcdTUzOUZcdTc1MUZcdTYzRDJcdTRFRjZcdThENDRcdTZFOTBcdTU5MERcdTUyMzZcdTYzRDJcdTRFRjYgLSBcdTRFQzVcdTU3MjggYXBwIFx1NUU3M1x1NTNGMFx1NEUxNFx1NTQyRlx1NzUyOFx1NjVGNlx1NzUxRlx1NjU0OFxuICAgICAgY3JlYXRlQ29weU5hdGl2ZVJlc291cmNlc1BsdWdpbihcbiAgICAgICAgVU5JX1BMQVRGT1JNID09PSAnYXBwJyAmJiBWSVRFX0NPUFlfTkFUSVZFX1JFU19FTkFCTEUgPT09ICd0cnVlJyxcbiAgICAgICAge1xuICAgICAgICAgIHZlcmJvc2U6IG1vZGUgPT09ICdkZXZlbG9wbWVudCcsIC8vIFx1NUYwMFx1NTNEMVx1NkEyMVx1NUYwRlx1NjYzRVx1NzkzQVx1OEJFNlx1N0VDNlx1NjVFNVx1NUZEN1xuICAgICAgICB9LFxuICAgICAgKSxcbiAgICAgIHN5bmNNYW5pZmVzdFBsdWdpbigpLFxuICAgICAgQ29tcG9uZW50cyh7XG4gICAgICAgIHJlc29sdmVyczogW1dvdFJlc29sdmVyKCldLFxuICAgICAgICBleHRlbnNpb25zOiBbJ3Z1ZSddLFxuICAgICAgICBkZWVwOiB0cnVlLCAvLyBcdTY2MkZcdTU0MjZcdTkwMTJcdTVGNTJcdTYyNkJcdTYzQ0ZcdTVCNTBcdTc2RUVcdTVGNTVcdUZGMENcbiAgICAgICAgZGlyZWN0b3J5QXNOYW1lc3BhY2U6IGZhbHNlLCAvLyBcdTY2MkZcdTU0MjZcdTYyOEFcdTc2RUVcdTVGNTVcdTU0MERcdTRGNUNcdTRFM0FcdTU0N0RcdTU0MERcdTdBN0FcdTk1RjRcdTUyNERcdTdGMDBcdUZGMEN0cnVlIFx1NjVGNlx1N0VDNFx1NEVGNlx1NTQwRFx1NEUzQSBcdTc2RUVcdTVGNTVcdTU0MEQrXHU3RUM0XHU0RUY2XHU1NDBEXHVGRjBDXG4gICAgICAgIGR0czogJ3NyYy90eXBlcy9jb21wb25lbnRzLmQudHMnLCAvLyBcdTgxRUFcdTUyQThcdTc1MUZcdTYyMTBcdTc2ODRcdTdFQzRcdTRFRjZcdTdDN0JcdTU3OEJcdTU4RjBcdTY2MEVcdTY1ODdcdTRFRjZcdThERUZcdTVGODRcdUZGMDhcdTc1MjhcdTRFOEUgVHlwZVNjcmlwdCBcdTY1MkZcdTYzMDFcdUZGMDlcbiAgICAgIH0pLFxuICAgICAgLy8gXHU4MUVBXHU1MkE4XHU2MjUzXHU1RjAwXHU1RjAwXHU1M0QxXHU4MDA1XHU1REU1XHU1MTc3XHU2M0QyXHU0RUY2IChcdTVGQzVcdTk4N0JcdTRGRUVcdTY1MzkgLmVudiBcdTY1ODdcdTRFRjZcdTRFMkRcdTc2ODQgVklURV9XWF9BUFBJRClcbiAgICAgIG9wZW5EZXZUb29scygpLFxuICAgIF0sXG4gICAgZGVmaW5lOiB7XG4gICAgICBfX1ZJVEVfQVBQX1BST1hZX186IEpTT04uc3RyaW5naWZ5KFZJVEVfQVBQX1BST1hZX0VOQUJMRSksXG4gICAgfSxcbiAgICBjc3M6IHtcbiAgICAgIHBvc3Rjc3M6IHtcbiAgICAgICAgcGx1Z2luczogW1xuICAgICAgICAgIC8vIGF1dG9wcmVmaXhlcih7XG4gICAgICAgICAgLy8gICAvLyBcdTYzMDdcdTVCOUFcdTc2RUVcdTY4MDdcdTZENEZcdTg5QzhcdTU2NjhcbiAgICAgICAgICAvLyAgIG92ZXJyaWRlQnJvd3NlcnNsaXN0OiBbJz4gMSUnLCAnbGFzdCAyIHZlcnNpb25zJ10sXG4gICAgICAgICAgLy8gfSksXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIH0sXG5cbiAgICByZXNvbHZlOiB7XG4gICAgICBhbGlhczoge1xuICAgICAgICAnQCc6IHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCAnLi9zcmMnKSxcbiAgICAgICAgJ0BpbWcnOiBwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgJy4vc3JjL3N0YXRpYy9pbWFnZXMnKSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICBzZXJ2ZXI6IHtcbiAgICAgIGhvc3Q6ICcwLjAuMC4wJyxcbiAgICAgIGhtcjogdHJ1ZSxcbiAgICAgIHBvcnQ6IE51bWJlci5wYXJzZUludChWSVRFX0FQUF9QT1JULCAxMCksXG4gICAgICAvLyBcdTRFQzUgSDUgXHU3QUVGXHU3NTFGXHU2NTQ4XHVGRjBDXHU1MTc2XHU0RUQ2XHU3QUVGXHU0RTBEXHU3NTFGXHU2NTQ4XHVGRjA4XHU1MTc2XHU0RUQ2XHU3QUVGXHU4RDcwYnVpbGRcdUZGMENcdTRFMERcdThENzBkZXZTZXJ2ZXIpXG4gICAgICBwcm94eTogSlNPTi5wYXJzZShWSVRFX0FQUF9QUk9YWV9FTkFCTEUpXG4gICAgICAgID8ge1xuICAgICAgICAgICAgW1ZJVEVfQVBQX1BST1hZX1BSRUZJWF06IHtcbiAgICAgICAgICAgICAgdGFyZ2V0OiBWSVRFX1NFUlZFUl9CQVNFVVJMLFxuICAgICAgICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXG4gICAgICAgICAgICAgIC8vIFx1NTQwRVx1N0FFRlx1NjcwOS9hcGlcdTUyNERcdTdGMDBcdTUyMTlcdTRFMERcdTUwNUFcdTU5MDRcdTc0MDZcdUZGMENcdTZDQTFcdTY3MDlcdTUyMTlcdTk3MDBcdTg5ODFcdTUzQkJcdTYzODlcbiAgICAgICAgICAgICAgcmV3cml0ZTogcGF0aCA9PiBwYXRoLnJlcGxhY2UobmV3IFJlZ0V4cChgXiR7VklURV9BUFBfUFJPWFlfUFJFRklYfWApLCAnJyksXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH1cbiAgICAgICAgOiB1bmRlZmluZWQsXG4gICAgfSxcbiAgICBlc2J1aWxkOiB7XG4gICAgICBkcm9wOiBWSVRFX0RFTEVURV9DT05TT0xFID09PSAndHJ1ZScgPyBbJ2NvbnNvbGUnLCAnZGVidWdnZXInXSA6IFtdLFxuICAgIH0sXG4gICAgYnVpbGQ6IHtcbiAgICAgIHNvdXJjZW1hcDogZmFsc2UsXG4gICAgICAvLyBcdTY1QjlcdTRGQkZcdTk3NUVoNVx1N0FFRlx1OEMwM1x1OEJENVxuICAgICAgLy8gc291cmNlbWFwOiBWSVRFX1NIT1dfU09VUkNFTUFQID09PSAndHJ1ZScsIC8vIFx1OUVEOFx1OEJBNFx1NjYyRmZhbHNlXG4gICAgICB0YXJnZXQ6ICdlczYnLFxuICAgICAgLy8gXHU1RjAwXHU1M0QxXHU3M0FGXHU1ODgzXHU0RTBEXHU3NTI4XHU1MzhCXHU3RjI5XG4gICAgICBtaW5pZnk6IG1vZGUgPT09ICdkZXZlbG9wbWVudCcgPyBmYWxzZSA6ICdlc2J1aWxkJyxcbiAgICB9LFxuICB9KVxufSlcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRDpcXFxcaWRlYVxcXFxsb2NrdGVzdFxcXFx5dWRhby11aS1hZG1pbi11bmlhcHAtbWFzdGVyXFxcXHNjcmlwdHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXGlkZWFcXFxcbG9ja3Rlc3RcXFxceXVkYW8tdWktYWRtaW4tdW5pYXBwLW1hc3RlclxcXFxzY3JpcHRzXFxcXG9wZW4tZGV2LXRvb2xzLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9pZGVhL2xvY2t0ZXN0L3l1ZGFvLXVpLWFkbWluLXVuaWFwcC1tYXN0ZXIvc2NyaXB0cy9vcGVuLWRldi10b29scy5qc1wiO2ltcG9ydCB7IGV4ZWMgfSBmcm9tICdub2RlOmNoaWxkX3Byb2Nlc3MnXG5pbXBvcnQgZnMgZnJvbSAnbm9kZTpmcydcbmltcG9ydCBwYXRoIGZyb20gJ25vZGU6cGF0aCdcbmltcG9ydCBwcm9jZXNzIGZyb20gJ25vZGU6cHJvY2VzcydcblxuLyoqXG4gKiBcdTYyNTNcdTVGMDBcdTVGMDBcdTUzRDFcdTgwMDVcdTVERTVcdTUxNzdcbiAqL1xuZnVuY3Rpb24gX29wZW5EZXZUb29scygpIHtcbiAgY29uc3QgcGxhdGZvcm0gPSBwcm9jZXNzLnBsYXRmb3JtIC8vIGRhcndpbiwgd2luMzIsIGxpbnV4XG4gIGNvbnN0IHsgVU5JX1BMQVRGT1JNIH0gPSBwcm9jZXNzLmVudiAvLyAgbXAtd2VpeGluLCBtcC1hbGlwYXlcblxuICBjb25zdCB1bmlQbGF0Zm9ybVRleHQgPSBVTklfUExBVEZPUk0gPT09ICdtcC13ZWl4aW4nID8gJ1x1NUZBRVx1NEZFMVx1NUMwRlx1N0EwQlx1NUU4RicgOiBVTklfUExBVEZPUk0gPT09ICdtcC1hbGlwYXknID8gJ1x1NjUyRlx1NEVEOFx1NUI5RFx1NUMwRlx1N0EwQlx1NUU4RicgOiAnXHU1QzBGXHU3QTBCXHU1RThGJ1xuXG4gIC8vIFx1OTg3OVx1NzZFRVx1OERFRlx1NUY4NFx1RkYwOFx1Njc4NFx1NUVGQVx1OEY5M1x1NTFGQVx1NzZFRVx1NUY1NVx1RkYwOVxuICBjb25zdCBwcm9qZWN0UGF0aCA9IHBhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLCBgZGlzdC9kZXYvJHtVTklfUExBVEZPUk19YClcblxuICAvLyBcdTY4QzBcdTY3RTVcdTY3ODRcdTVFRkFcdThGOTNcdTUxRkFcdTc2RUVcdTVGNTVcdTY2MkZcdTU0MjZcdTVCNThcdTU3MjhcbiAgaWYgKCFmcy5leGlzdHNTeW5jKHByb2plY3RQYXRoKSkge1xuICAgIGNvbnNvbGUubG9nKGBcdTI3NEMgJHt1bmlQbGF0Zm9ybVRleHR9XHU2Nzg0XHU1RUZBXHU3NkVFXHU1RjU1XHU0RTBEXHU1QjU4XHU1NzI4OmAsIHByb2plY3RQYXRoKVxuICAgIHJldHVyblxuICB9XG5cbiAgY29uc29sZS5sb2coYFx1RDgzRFx1REU4MCBcdTZCNjNcdTU3MjhcdTYyNTNcdTVGMDAke3VuaVBsYXRmb3JtVGV4dH1cdTVGMDBcdTUzRDFcdTgwMDVcdTVERTVcdTUxNzcuLi5gKVxuXG4gIC8vIFx1NjgzOVx1NjM2RVx1NEUwRFx1NTQwQ1x1NjRDRFx1NEY1Q1x1N0NGQlx1N0VERlx1NjI2N1x1ODg0Q1x1NEUwRFx1NTQwQ1x1NTQ3RFx1NEVFNFxuICBsZXQgY29tbWFuZCA9ICcnXG5cbiAgaWYgKHBsYXRmb3JtID09PSAnZGFyd2luJykge1xuICAgIC8vIG1hY09TXG4gICAgaWYgKFVOSV9QTEFURk9STSA9PT0gJ21wLXdlaXhpbicpIHtcbiAgICAgIGNvbW1hbmQgPSBgL0FwcGxpY2F0aW9ucy93ZWNoYXR3ZWJkZXZ0b29scy5hcHAvQ29udGVudHMvTWFjT1MvY2xpIC1vIFwiJHtwcm9qZWN0UGF0aH1cImBcbiAgICB9XG4gICAgZWxzZSBpZiAoVU5JX1BMQVRGT1JNID09PSAnbXAtYWxpcGF5Jykge1xuICAgICAgY29tbWFuZCA9IGAvQXBwbGljYXRpb25zL1x1NUMwRlx1N0EwQlx1NUU4Rlx1NUYwMFx1NTNEMVx1ODAwNVx1NURFNVx1NTE3Ny5hcHAvQ29udGVudHMvTWFjT1MvXHU1QzBGXHU3QTBCXHU1RThGXHU1RjAwXHU1M0QxXHU4MDA1XHU1REU1XHU1MTc3IC0tcCBcIiR7cHJvamVjdFBhdGh9XCJgXG4gICAgfVxuICB9XG4gIGVsc2UgaWYgKHBsYXRmb3JtID09PSAnd2luMzInIHx8IHBsYXRmb3JtID09PSAnd2luNjQnKSB7XG4gICAgLy8gV2luZG93c1xuICAgIGlmIChVTklfUExBVEZPUk0gPT09ICdtcC13ZWl4aW4nKSB7XG4gICAgICBjb21tYW5kID0gYFwiQzpcXFxcUHJvZ3JhbSBGaWxlcyAoeDg2KVxcXFxUZW5jZW50XFxcXFx1NUZBRVx1NEZFMXdlYlx1NUYwMFx1NTNEMVx1ODAwNVx1NURFNVx1NTE3N1xcXFxjbGkuYmF0XCIgLW8gXCIke3Byb2plY3RQYXRofVwiYFxuICAgIH1cbiAgfVxuICBlbHNlIHtcbiAgICAvLyBMaW51eCBcdTYyMTZcdTUxNzZcdTRFRDZcdTdDRkJcdTdFREZcbiAgICBjb25zb2xlLmxvZygnXHUyNzRDIFx1NUY1M1x1NTI0RFx1N0NGQlx1N0VERlx1NEUwRFx1NjUyRlx1NjMwMVx1ODFFQVx1NTJBOFx1NjI1M1x1NUYwMFx1NUZBRVx1NEZFMVx1NUYwMFx1NTNEMVx1ODAwNVx1NURFNVx1NTE3NycpXG4gICAgcmV0dXJuXG4gIH1cblxuICBleGVjKGNvbW1hbmQsIChlcnJvciwgc3Rkb3V0LCBzdGRlcnIpID0+IHtcbiAgICBpZiAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUubG9nKGBcdTI3NEMgXHU2MjUzXHU1RjAwJHt1bmlQbGF0Zm9ybVRleHR9XHU1RjAwXHU1M0QxXHU4MDA1XHU1REU1XHU1MTc3XHU1OTMxXHU4RDI1OmAsIGVycm9yLm1lc3NhZ2UpXG4gICAgICBjb25zb2xlLmxvZyhgXHVEODNEXHVEQ0ExIFx1OEJGN1x1Nzg2RVx1NEZERCR7dW5pUGxhdGZvcm1UZXh0fVx1NUYwMFx1NTNEMVx1ODAwNVx1NURFNVx1NTE3N1x1NjcwRFx1NTJBMVx1N0FFRlx1NTNFM1x1NURGMlx1NTQyRlx1NzUyOGApXG4gICAgICBjb25zb2xlLmxvZyhgXHVEODNEXHVEQ0ExIFx1NTNFRlx1NEVFNVx1NjI0Qlx1NTJBOFx1NjI1M1x1NUYwMCR7dW5pUGxhdGZvcm1UZXh0fVx1NUYwMFx1NTNEMVx1ODAwNVx1NURFNVx1NTE3N1x1NUU3Nlx1NUJGQ1x1NTE2NVx1OTg3OVx1NzZFRTpgLCBwcm9qZWN0UGF0aClcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGlmIChzdGRlcnIpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdcdTI2QTBcdUZFMEYgXHU4QjY2XHU1NDRBOicsIHN0ZGVycilcbiAgICB9XG5cbiAgICBjb25zb2xlLmxvZyhgXHUyNzA1ICR7dW5pUGxhdGZvcm1UZXh0fVx1NUYwMFx1NTNEMVx1ODAwNVx1NURFNVx1NTE3N1x1NURGMlx1NjI1M1x1NUYwMGApXG5cbiAgICBpZiAoc3Rkb3V0KSB7XG4gICAgICBjb25zb2xlLmxvZyhzdGRvdXQpXG4gICAgfVxuICB9KVxufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBvcGVuRGV2VG9vbHMoKSB7XG4gIC8vIFx1OTk5Nlx1NkIyMVx1Njc4NFx1NUVGQVx1NjgwN1x1OEJCMFxuICBsZXQgaXNGaXJzdEJ1aWxkID0gdHJ1ZVxuXG4gIHJldHVybiB7XG4gICAgbmFtZTogJ3VuaS1kZXZ0b29scycsXG4gICAgd3JpdGVCdW5kbGUoKSB7XG4gICAgICBpZiAoaXNGaXJzdEJ1aWxkICYmIHByb2Nlc3MuZW52LlVOSV9QTEFURk9STT8uaW5jbHVkZXMoJ21wJykpIHtcbiAgICAgICAgaXNGaXJzdEJ1aWxkID0gZmFsc2VcbiAgICAgICAgX29wZW5EZXZUb29scygpXG4gICAgICB9XG4gICAgfSxcbiAgfVxufVxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxpZGVhXFxcXGxvY2t0ZXN0XFxcXHl1ZGFvLXVpLWFkbWluLXVuaWFwcC1tYXN0ZXJcXFxcdml0ZS1wbHVnaW5zXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxpZGVhXFxcXGxvY2t0ZXN0XFxcXHl1ZGFvLXVpLWFkbWluLXVuaWFwcC1tYXN0ZXJcXFxcdml0ZS1wbHVnaW5zXFxcXGNvcHktbmF0aXZlLXJlc291cmNlcy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovaWRlYS9sb2NrdGVzdC95dWRhby11aS1hZG1pbi11bmlhcHAtbWFzdGVyL3ZpdGUtcGx1Z2lucy9jb3B5LW5hdGl2ZS1yZXNvdXJjZXMudHNcIjtpbXBvcnQgdHlwZSB7IFBsdWdpbiB9IGZyb20gJ3ZpdGUnXG5pbXBvcnQgcGF0aCBmcm9tICdub2RlOnBhdGgnXG5pbXBvcnQgcHJvY2VzcyBmcm9tICdub2RlOnByb2Nlc3MnXG5pbXBvcnQgZnMgZnJvbSAnZnMtZXh0cmEnXG5cbi8qKlxuICogXHU1MzlGXHU3NTFGXHU2M0QyXHU0RUY2XHU4RDQ0XHU2RTkwXHU1OTBEXHU1MjM2XHU5MTREXHU3RjZFXHU2M0E1XHU1M0UzXG4gKlxuICogXHU2ODM5XHU2MzZFIFVuaUFwcCBcdTVCOThcdTY1QjlcdTY1ODdcdTY4NjNcdUZGMUFodHRwczovL3VuaWFwcC5kY2xvdWQubmV0LmNuL3BsdWdpbi9uYXRpdmUtcGx1Z2luLmh0bWwjJUU2JTlDJUFDJUU1JTlDJUIwJUU2JThGJTkyJUU0JUJCJUI2LSVFOSU5RCU5RSVFNSU4NiU4NSVFNyVCRCVBRSVFNSU4RSU5RiVFNyU5NCU5RiVFNiU4RiU5MiVFNCVCQiVCNlxuICogXHU2NzJDXHU1NzMwXHU2M0QyXHU0RUY2XHU1RTk0XHU4QkU1XHU1QjU4XHU1MEE4XHU1NzI4XHU5ODc5XHU3NkVFXHU2ODM5XHU3NkVFXHU1RjU1XHU3Njg0IG5hdGl2ZXBsdWdpbnMgXHU3NkVFXHU1RjU1XHU0RTBCXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ29weU5hdGl2ZVJlc291cmNlc09wdGlvbnMge1xuICAvKiogXHU2NjJGXHU1NDI2XHU1NDJGXHU3NTI4XHU2M0QyXHU0RUY2ICovXG4gIGVuYWJsZT86IGJvb2xlYW5cbiAgLyoqXG4gICAqIFx1NkU5MFx1NzZFRVx1NUY1NVx1OERFRlx1NUY4NFx1RkYwQ1x1NzZGOFx1NUJGOVx1NEU4RVx1OTg3OVx1NzZFRVx1NjgzOVx1NzZFRVx1NUY1NVxuICAgKiBcdTlFRDhcdThCQTRcdTRFM0EgJ25hdGl2ZXBsdWdpbnMnXHVGRjBDXHU3QjI2XHU1NDA4IFVuaUFwcCBcdTVCOThcdTY1QjlcdTg5QzRcdTgzMDNcbiAgICogQHNlZSBodHRwczovL3VuaWFwcC5kY2xvdWQubmV0LmNuL3BsdWdpbi9uYXRpdmUtcGx1Z2luLmh0bWwjJUU2JTlDJUFDJUU1JTlDJUIwJUU2JThGJTkyJUU0JUJCJUI2LSVFOSU5RCU5RSVFNSU4NiU4NSVFNyVCRCVBRSVFNSU4RSU5RiVFNyU5NCU5RiVFNiU4RiU5MiVFNCVCQiVCNlxuICAgKi9cbiAgc291cmNlRGlyPzogc3RyaW5nXG4gIC8qKlxuICAgKiBcdTc2RUVcdTY4MDdcdTc2RUVcdTVGNTVcdTU0MERcdTc5RjBcdUZGMENcdTY3ODRcdTVFRkFcdTU0MEVcdTU3MjggZGlzdCBcdTc2RUVcdTVGNTVcdTRFMkRcdTc2ODRcdTY1ODdcdTRFRjZcdTU5MzlcdTU0MERcbiAgICogXHU5RUQ4XHU4QkE0XHU0RTNBICduYXRpdmVwbHVnaW5zJ1x1RkYwQ1x1NEUwRVx1NkU5MFx1NzZFRVx1NUY1NVx1NEZERFx1NjMwMVx1NEUwMFx1ODFGNFxuICAgKi9cbiAgdGFyZ2V0RGlyTmFtZT86IHN0cmluZ1xuICAvKiogXHU2NjJGXHU1NDI2XHU2NjNFXHU3OTNBXHU4QkU2XHU3RUM2XHU2NUU1XHU1RkQ3XHVGRjBDXHU0RkJGXHU0RThFXHU4QzAzXHU4QkQ1XHU1NDhDXHU3NkQxXHU2M0E3XHU1OTBEXHU1MjM2XHU4RkM3XHU3QTBCICovXG4gIHZlcmJvc2U/OiBib29sZWFuXG4gIC8qKiBcdTgxRUFcdTVCOUFcdTRFNDlcdTY1RTVcdTVGRDdcdTUyNERcdTdGMDBcdUZGMENcdTc1MjhcdTRFOEVcdTUzM0FcdTUyMDZcdTRFMERcdTU0MENcdTYzRDJcdTRFRjZcdTc2ODRcdTY1RTVcdTVGRDdcdThGOTNcdTUxRkEgKi9cbiAgbG9nUHJlZml4Pzogc3RyaW5nXG59XG5cbi8qKlxuICogXHU5RUQ4XHU4QkE0XHU5MTREXHU3RjZFXG4gKlxuICogXHU2ODM5XHU2MzZFIFVuaUFwcCBcdTVCOThcdTY1QjlcdTY1ODdcdTY4NjNcdTg5QzRcdTgzMDNcdThCQkVcdTdGNkVcdTlFRDhcdThCQTRcdTUwM0NcdUZGMUFcbiAqIC0gc291cmNlRGlyOiAnbmF0aXZlcGx1Z2lucycgLSBcdTdCMjZcdTU0MDhcdTVCOThcdTY1QjlcdTY3MkNcdTU3MzBcdTYzRDJcdTRFRjZcdTVCNThcdTUwQThcdTg5QzRcdTgzMDNcbiAqIC0gdGFyZ2V0RGlyTmFtZTogJ25hdGl2ZXBsdWdpbnMnIC0gXHU2Nzg0XHU1RUZBXHU1NDBFXHU0RkREXHU2MzAxXHU3NkY4XHU1NDBDXHU3Njg0XHU3NkVFXHU1RjU1XHU3RUQzXHU2Nzg0XG4gKi9cbmNvbnN0IERFRkFVTFRfT1BUSU9OUzogUmVxdWlyZWQ8Q29weU5hdGl2ZVJlc291cmNlc09wdGlvbnM+ID0ge1xuICBlbmFibGU6IHRydWUsXG4gIHNvdXJjZURpcjogJ25hdGl2ZXBsdWdpbnMnLFxuICB0YXJnZXREaXJOYW1lOiAnbmF0aXZlcGx1Z2lucycsXG4gIHZlcmJvc2U6IHRydWUsXG4gIGxvZ1ByZWZpeDogJ1tjb3B5LW5hdGl2ZS1yZXNvdXJjZXNdJyxcbn1cblxuLyoqXG4gKiBVbmlBcHAgXHU1MzlGXHU3NTFGXHU2M0QyXHU0RUY2XHU4RDQ0XHU2RTkwXHU1OTBEXHU1MjM2XHU2M0QyXHU0RUY2XG4gKlxuICogXHU1MjlGXHU4MEZEXHU4QkY0XHU2NjBFXHVGRjFBXG4gKiAxLiBcdTg5RTNcdTUxQjMgVW5pQXBwIFx1NEY3Rlx1NzUyOFx1NjcyQ1x1NTczMFx1NTM5Rlx1NzUxRlx1NjNEMlx1NEVGNlx1NjVGNlx1RkYwQ1x1NjI1M1x1NTMwNVx1NTQwRVx1NTM5Rlx1NzUxRlx1NjNEMlx1NEVGNlx1OEQ0NFx1NkU5MFx1NjI3RVx1NEUwRFx1NTIzMFx1NzY4NFx1OTVFRVx1OTg5OFxuICogMi4gXHU1QzA2XHU5ODc5XHU3NkVFXHU2ODM5XHU3NkVFXHU1RjU1XHU0RTBCXHU3Njg0IG5hdGl2ZXBsdWdpbnMgXHU3NkVFXHU1RjU1XHU1OTBEXHU1MjM2XHU1MjMwXHU2Nzg0XHU1RUZBXHU4RjkzXHU1MUZBXHU3NkVFXHU1RjU1XHU0RTJEXG4gKiAzLiBcdTY1MkZcdTYzMDEgQW5kcm9pZCBcdTU0OEMgaU9TIFx1NUU3M1x1NTNGMFx1NzY4NFx1NTM5Rlx1NzUxRlx1NjNEMlx1NEVGNlx1OEQ0NFx1NkU5MFx1NTkwRFx1NTIzNlxuICogNC4gXHU0RUM1XHU1NzI4IGFwcCBcdTVFNzNcdTUzRjBcdTY3ODRcdTVFRkFcdTY1RjZcdTc1MUZcdTY1NDhcdUZGMENcdTUxNzZcdTRFRDZcdTVFNzNcdTUzRjBcdUZGMDhINVx1MzAwMVx1NUMwRlx1N0EwQlx1NUU4Rlx1RkYwOVx1NEUwRFx1NjI2N1x1ODg0Q1xuICpcbiAqIFx1NEY3Rlx1NzUyOFx1NTczQVx1NjY2Rlx1RkYxQVxuICogLSBcdTRGN0ZcdTc1MjhcdTRFODYgVW5pQXBwIFx1NjcyQ1x1NTczMFx1NTM5Rlx1NzUxRlx1NjNEMlx1NEVGNlx1RkYwOFx1OTc1RVx1NEU5MVx1N0FFRlx1NjNEMlx1NEVGNlx1RkYwOVxuICogLSBcdTUzOUZcdTc1MUZcdTYzRDJcdTRFRjZcdTUzMDVcdTU0MkJcdTk4OURcdTU5MTZcdTc2ODRcdThENDRcdTZFOTBcdTY1ODdcdTRFRjZcdUZGMDhcdTU5ODIgLnNvIFx1NUU5M1x1NjU4N1x1NEVGNlx1MzAwMVx1OTE0RFx1N0Y2RVx1NjU4N1x1NEVGNlx1N0I0OVx1RkYwOVxuICogLSBcdTk3MDBcdTg5ODFcdTU3MjhcdTYyNTNcdTUzMDVcdTU0MEVcdTRGRERcdTYzMDFcdTUzOUZcdTc1MUZcdTYzRDJcdTRFRjZcdTc2ODRcdTVCOENcdTY1NzRcdTc2RUVcdTVGNTVcdTdFRDNcdTY3ODRcbiAqXG4gKiBcdTVCOThcdTY1QjlcdTY1ODdcdTY4NjNcdTUzQzJcdTgwMDNcdUZGMUFcbiAqIEBzZWUgaHR0cHM6Ly91bmlhcHAuZGNsb3VkLm5ldC5jbi9wbHVnaW4vbmF0aXZlLXBsdWdpbi5odG1sIyVFNiU5QyVBQyVFNSU5QyVCMCVFNiU4RiU5MiVFNCVCQiVCNi0lRTklOUQlOUUlRTUlODYlODUlRTclQkQlQUUlRTUlOEUlOUYlRTclOTQlOUYlRTYlOEYlOTIlRTQlQkIlQjZcbiAqIEBzZWUgaHR0cHM6Ly91bmlhcHAuZGNsb3VkLm5ldC5jbi90dXRvcmlhbC9udnVlLWFwaS5odG1sI2RvbVxuICpcbiAqIEBwYXJhbSBvcHRpb25zIFx1NjNEMlx1NEVGNlx1OTE0RFx1N0Y2RVx1OTAwOVx1OTg3OVxuICogQHJldHVybnMgVml0ZSBcdTYzRDJcdTRFRjZcdTVCRjlcdThDNjFcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvcHlOYXRpdmVSZXNvdXJjZXMob3B0aW9uczogQ29weU5hdGl2ZVJlc291cmNlc09wdGlvbnMgPSB7fSk6IFBsdWdpbiB7XG4gIGNvbnN0IGNvbmZpZyA9IHsgLi4uREVGQVVMVF9PUFRJT05TLCAuLi5vcHRpb25zIH1cblxuICAvLyBcdTU5ODJcdTY3OUNcdTYzRDJcdTRFRjZcdTg4QUJcdTc5ODFcdTc1MjhcdUZGMENcdThGRDRcdTU2REVcdTRFMDBcdTRFMkFcdTdBN0FcdTYzRDJcdTRFRjZcbiAgaWYgKCFjb25maWcuZW5hYmxlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWU6ICdjb3B5LW5hdGl2ZS1yZXNvdXJjZXMtZGlzYWJsZWQnLFxuICAgICAgYXBwbHk6ICdidWlsZCcsXG4gICAgICB3cml0ZUJ1bmRsZSgpIHtcbiAgICAgICAgLy8gXHU2M0QyXHU0RUY2XHU1REYyXHU3OTgxXHU3NTI4XHVGRjBDXHU0RTBEXHU2MjY3XHU4ODRDXHU0RUZCXHU0RjU1XHU2NENEXHU0RjVDXG4gICAgICB9LFxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7XG4gICAgbmFtZTogJ2NvcHktbmF0aXZlLXJlc291cmNlcycsXG4gICAgYXBwbHk6ICdidWlsZCcsIC8vIFx1NTNFQVx1NTcyOFx1Njc4NFx1NUVGQVx1NjVGNlx1NUU5NFx1NzUyOFxuICAgIGVuZm9yY2U6ICdwb3N0JywgLy8gXHU1NzI4XHU1MTc2XHU0RUQ2XHU2M0QyXHU0RUY2XHU2MjY3XHU4ODRDXHU1QjhDXHU2QkQ1XHU1NDBFXHU2MjY3XHU4ODRDXG5cbiAgICBhc3luYyB3cml0ZUJ1bmRsZSgpIHtcbiAgICAgIGNvbnN0IHsgc291cmNlRGlyLCB0YXJnZXREaXJOYW1lLCB2ZXJib3NlLCBsb2dQcmVmaXggfSA9IGNvbmZpZ1xuXG4gICAgICB0cnkge1xuICAgICAgICAvLyBcdTgzQjdcdTUzRDZcdTk4NzlcdTc2RUVcdTY4MzlcdTc2RUVcdTVGNTVcdThERUZcdTVGODRcbiAgICAgICAgY29uc3QgcHJvamVjdFJvb3QgPSBwcm9jZXNzLmN3ZCgpXG5cbiAgICAgICAgLy8gXHU2Nzg0XHU1RUZBXHU2RTkwXHU3NkVFXHU1RjU1XHU3RUREXHU1QkY5XHU4REVGXHU1Rjg0XHVGRjA4XHU5ODc5XHU3NkVFXHU2ODM5XHU3NkVFXHU1RjU1XHU0RTBCXHU3Njg0IG5hdGl2ZXBsdWdpbnMgXHU3NkVFXHU1RjU1XHVGRjA5XG4gICAgICAgIGNvbnN0IHNvdXJjZVBhdGggPSBwYXRoLnJlc29sdmUocHJvamVjdFJvb3QsIHNvdXJjZURpcilcblxuICAgICAgICAvLyBcdTY3ODRcdTVFRkFcdTc2RUVcdTY4MDdcdThERUZcdTVGODRcdUZGMUFkaXN0L1tidWlsZHxkZXZdL1twbGF0Zm9ybV0vbmF0aXZlcGx1Z2luc1xuICAgICAgICAvLyBidWlsZE1vZGU6ICdidWlsZCcgKFx1NzUxRlx1NEVBN1x1NzNBRlx1NTg4MykgXHU2MjE2ICdkZXYnIChcdTVGMDBcdTUzRDFcdTczQUZcdTU4ODMpXG4gICAgICAgIC8vIHBsYXRmb3JtOiAnYXBwJyAoQXBwXHU1RTczXHU1M0YwKSBcdTYyMTZcdTUxNzZcdTRFRDZcdTVFNzNcdTUzRjBcdTY4MDdcdThCQzZcbiAgICAgICAgY29uc3QgYnVpbGRNb2RlID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdwcm9kdWN0aW9uJyA/ICdidWlsZCcgOiAnZGV2J1xuICAgICAgICBjb25zdCBwbGF0Zm9ybSA9IHByb2Nlc3MuZW52LlVOSV9QTEFURk9STSB8fCAnYXBwJ1xuICAgICAgICBjb25zdCB0YXJnZXRQYXRoID0gcGF0aC5yZXNvbHZlKFxuICAgICAgICAgIHByb2plY3RSb290LFxuICAgICAgICAgICdkaXN0JyxcbiAgICAgICAgICBidWlsZE1vZGUsXG4gICAgICAgICAgcGxhdGZvcm0sXG4gICAgICAgICAgdGFyZ2V0RGlyTmFtZSxcbiAgICAgICAgKVxuXG4gICAgICAgIC8vIFx1NjhDMFx1NjdFNVx1NkU5MFx1NzZFRVx1NUY1NVx1NjYyRlx1NTQyNlx1NUI1OFx1NTcyOFxuICAgICAgICAvLyBcdTU5ODJcdTY3OUNcdTRFMERcdTVCNThcdTU3MjggbmF0aXZlcGx1Z2lucyBcdTc2RUVcdTVGNTVcdUZGMENcdThCRjRcdTY2MEVcdTk4NzlcdTc2RUVcdTZDQTFcdTY3MDlcdTRGN0ZcdTc1MjhcdTY3MkNcdTU3MzBcdTUzOUZcdTc1MUZcdTYzRDJcdTRFRjZcbiAgICAgICAgY29uc3Qgc291cmNlRXhpc3RzID0gYXdhaXQgZnMucGF0aEV4aXN0cyhzb3VyY2VQYXRoKVxuICAgICAgICBpZiAoIXNvdXJjZUV4aXN0cykge1xuICAgICAgICAgIGlmICh2ZXJib3NlKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oYCR7bG9nUHJlZml4fSBcdTZFOTBcdTc2RUVcdTVGNTVcdTRFMERcdTVCNThcdTU3MjhcdUZGMENcdThERjNcdThGQzdcdTU5MERcdTUyMzZcdTY0Q0RcdTRGNUNgKVxuICAgICAgICAgICAgY29uc29sZS53YXJuKGAke2xvZ1ByZWZpeH0gXHU2RTkwXHU3NkVFXHU1RjU1XHU4REVGXHU1Rjg0OiAke3NvdXJjZVBhdGh9YClcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihgJHtsb2dQcmVmaXh9IFx1NTk4Mlx1OTcwMFx1NEY3Rlx1NzUyOFx1NjcyQ1x1NTczMFx1NTM5Rlx1NzUxRlx1NjNEMlx1NEVGNlx1RkYwQ1x1OEJGN1x1NTcyOFx1OTg3OVx1NzZFRVx1NjgzOVx1NzZFRVx1NUY1NVx1NTIxQlx1NUVGQSBuYXRpdmVwbHVnaW5zIFx1NzZFRVx1NUY1NWApXG4gICAgICAgICAgICBjb25zb2xlLndhcm4oYCR7bG9nUHJlZml4fSBcdTVFNzZcdTYzMDlcdTcxNjdcdTVCOThcdTY1QjlcdTY1ODdcdTY4NjNcdTY1M0VcdTUxNjVcdTUzOUZcdTc1MUZcdTYzRDJcdTRFRjZcdTY1ODdcdTRFRjZgKVxuICAgICAgICAgICAgY29uc29sZS53YXJuKGAke2xvZ1ByZWZpeH0gXHU1M0MyXHU4MDAzOiBodHRwczovL3VuaWFwcC5kY2xvdWQubmV0LmNuL3BsdWdpbi9uYXRpdmUtcGx1Z2luLmh0bWxgKVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFx1NjhDMFx1NjdFNVx1NkU5MFx1NzZFRVx1NUY1NVx1NjYyRlx1NTQyNlx1NEUzQVx1N0E3QVxuICAgICAgICAvLyBcdTU5ODJcdTY3OUNcdTc2RUVcdTVGNTVcdTVCNThcdTU3MjhcdTRGNDZcdTRFM0FcdTdBN0FcdUZGMENcdTRFNUZcdThERjNcdThGQzdcdTU5MERcdTUyMzZcdTY0Q0RcdTRGNUNcbiAgICAgICAgY29uc3Qgc291cmNlRmlsZXMgPSBhd2FpdCBmcy5yZWFkZGlyKHNvdXJjZVBhdGgpXG4gICAgICAgIGlmIChzb3VyY2VGaWxlcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICBpZiAodmVyYm9zZSkge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKGAke2xvZ1ByZWZpeH0gXHU2RTkwXHU3NkVFXHU1RjU1XHU0RTNBXHU3QTdBXHVGRjBDXHU4REYzXHU4RkM3XHU1OTBEXHU1MjM2XHU2NENEXHU0RjVDYClcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihgJHtsb2dQcmVmaXh9IFx1NkU5MFx1NzZFRVx1NUY1NVx1OERFRlx1NUY4NDogJHtzb3VyY2VQYXRofWApXG4gICAgICAgICAgICBjb25zb2xlLndhcm4oYCR7bG9nUHJlZml4fSBcdThCRjdcdTU3MjggbmF0aXZlcGx1Z2lucyBcdTc2RUVcdTVGNTVcdTRFMkRcdTY1M0VcdTUxNjVcdTUzOUZcdTc1MUZcdTYzRDJcdTRFRjZcdTY1ODdcdTRFRjZgKVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFx1Nzg2RVx1NEZERFx1NzZFRVx1NjgwN1x1NzZFRVx1NUY1NVx1NTNDQVx1NTE3Nlx1NzIzNlx1NzZFRVx1NUY1NVx1NUI1OFx1NTcyOFxuICAgICAgICBhd2FpdCBmcy5lbnN1cmVEaXIodGFyZ2V0UGF0aClcblxuICAgICAgICBpZiAodmVyYm9zZSkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKGAke2xvZ1ByZWZpeH0gXHU1RjAwXHU1OUNCXHU1OTBEXHU1MjM2IFVuaUFwcCBcdTY3MkNcdTU3MzBcdTUzOUZcdTc1MUZcdTYzRDJcdTRFRjYuLi5gKVxuICAgICAgICAgIGNvbnNvbGUubG9nKGAke2xvZ1ByZWZpeH0gXHU2RTkwXHU3NkVFXHU1RjU1OiAke3NvdXJjZVBhdGh9YClcbiAgICAgICAgICBjb25zb2xlLmxvZyhgJHtsb2dQcmVmaXh9IFx1NzZFRVx1NjgwN1x1NzZFRVx1NUY1NTogJHt0YXJnZXRQYXRofWApXG4gICAgICAgICAgY29uc29sZS5sb2coYCR7bG9nUHJlZml4fSBcdTY3ODRcdTVFRkFcdTZBMjFcdTVGMEY6ICR7YnVpbGRNb2RlfWApXG4gICAgICAgICAgY29uc29sZS5sb2coYCR7bG9nUHJlZml4fSBcdTc2RUVcdTY4MDdcdTVFNzNcdTUzRjA6ICR7cGxhdGZvcm19YClcbiAgICAgICAgICBjb25zb2xlLmxvZyhgJHtsb2dQcmVmaXh9IFx1NTNEMVx1NzNCMCAke3NvdXJjZUZpbGVzLmxlbmd0aH0gXHU0RTJBXHU1MzlGXHU3NTFGXHU2M0QyXHU0RUY2XHU2NTg3XHU0RUY2L1x1NzZFRVx1NUY1NWApXG4gICAgICAgIH1cblxuICAgICAgICAvLyBcdTYyNjdcdTg4NENcdTY1ODdcdTRFRjZcdTU5MERcdTUyMzZcdTY0Q0RcdTRGNUNcbiAgICAgICAgLy8gXHU1QzA2XHU2NTc0XHU0RTJBIG5hdGl2ZXBsdWdpbnMgXHU3NkVFXHU1RjU1XHU1OTBEXHU1MjM2XHU1MjMwXHU2Nzg0XHU1RUZBXHU4RjkzXHU1MUZBXHU3NkVFXHU1RjU1XG4gICAgICAgIGF3YWl0IGZzLmNvcHkoc291cmNlUGF0aCwgdGFyZ2V0UGF0aCwge1xuICAgICAgICAgIG92ZXJ3cml0ZTogdHJ1ZSwgLy8gXHU4OTg2XHU3NkQ2XHU1REYyXHU1QjU4XHU1NzI4XHU3Njg0XHU2NTg3XHU0RUY2XHVGRjBDXHU3ODZFXHU0RkREXHU0RjdGXHU3NTI4XHU2NzAwXHU2NUIwXHU3MjQ4XHU2NzJDXG4gICAgICAgICAgZXJyb3JPbkV4aXN0OiBmYWxzZSwgLy8gXHU1OTgyXHU2NzlDXHU3NkVFXHU2ODA3XHU2NTg3XHU0RUY2XHU1QjU4XHU1NzI4XHU0RTBEXHU2MkE1XHU5NTE5XG4gICAgICAgICAgcHJlc2VydmVUaW1lc3RhbXBzOiB0cnVlLCAvLyBcdTRGRERcdTYzMDFcdTY1ODdcdTRFRjZcdTc2ODRcdTY1RjZcdTk1RjRcdTYyMzNcbiAgICAgICAgfSlcblxuICAgICAgICBpZiAodmVyYm9zZSkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKGAke2xvZ1ByZWZpeH0gXHUyNzA1IFVuaUFwcCBcdTY3MkNcdTU3MzBcdTUzOUZcdTc1MUZcdTYzRDJcdTRFRjZcdTU5MERcdTUyMzZcdTVCOENcdTYyMTBgKVxuICAgICAgICAgIGNvbnNvbGUubG9nKGAke2xvZ1ByZWZpeH0gXHU1REYyXHU2MjEwXHU1MjlGXHU1OTBEXHU1MjM2ICR7c291cmNlRmlsZXMubGVuZ3RofSBcdTRFMkFcdTY1ODdcdTRFRjYvXHU3NkVFXHU1RjU1XHU1MjMwXHU2Nzg0XHU1RUZBXHU3NkVFXHU1RjU1YClcbiAgICAgICAgICBjb25zb2xlLmxvZyhgJHtsb2dQcmVmaXh9IFx1NTM5Rlx1NzUxRlx1NjNEMlx1NEVGNlx1NzNCMFx1NTcyOFx1NTNFRlx1NEVFNVx1NTcyOCBBcHAgXHU0RTJEXHU2QjYzXHU1RTM4XHU0RjdGXHU3NTI4YClcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoYCR7Y29uZmlnLmxvZ1ByZWZpeH0gXHUyNzRDIFx1NTkwRFx1NTIzNiBVbmlBcHAgXHU2NzJDXHU1NzMwXHU1MzlGXHU3NTFGXHU2M0QyXHU0RUY2XHU1OTMxXHU4RDI1OmAsIGVycm9yKVxuICAgICAgICBjb25zb2xlLmVycm9yKGAke2NvbmZpZy5sb2dQcmVmaXh9IFx1OTUxOVx1OEJFRlx1OEJFNlx1NjBDNTpgLCBlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6IFN0cmluZyhlcnJvcikpXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoYCR7Y29uZmlnLmxvZ1ByZWZpeH0gXHU4QkY3XHU2OEMwXHU2N0U1XHU2RTkwXHU3NkVFXHU1RjU1XHU2NzQzXHU5NjUwXHU1NDhDXHU3OEMxXHU3NkQ4XHU3QTdBXHU5NUY0YClcbiAgICAgICAgLy8gXHU0RTBEXHU2MjlCXHU1MUZBXHU5NTE5XHU4QkVGXHVGRjBDXHU5MDdGXHU1MTREXHU1RjcxXHU1NENEXHU2NTc0XHU0RTJBXHU2Nzg0XHU1RUZBXHU4RkM3XHU3QTBCXHVGRjBDXHU0RjQ2XHU0RjFBXHU4QkIwXHU1RjU1XHU4QkU2XHU3RUM2XHU3Njg0XHU5NTE5XHU4QkVGXHU0RkUxXHU2MDZGXG4gICAgICB9XG4gICAgfSxcbiAgfVxufVxuXG4vKipcbiAqIFx1NTIxQlx1NUVGQSBVbmlBcHAgXHU2NzJDXHU1NzMwXHU1MzlGXHU3NTFGXHU2M0QyXHU0RUY2XHU4RDQ0XHU2RTkwXHU1OTBEXHU1MjM2XHU2M0QyXHU0RUY2XHU3Njg0XHU0RkJGXHU2Mzc3XHU1MUZEXHU2NTcwXG4gKlxuICogXHU4RkQ5XHU2NjJGXHU0RTAwXHU0RTJBXHU0RkJGXHU2Mzc3XHU3Njg0XHU1REU1XHU1MzgyXHU1MUZEXHU2NTcwXHVGRjBDXHU3NTI4XHU0RThFXHU1RkVCXHU5MDFGXHU1MjFCXHU1RUZBXHU2M0QyXHU0RUY2XHU1QjlFXHU0RjhCXG4gKiBcdTcyNzlcdTUyMkJcdTkwMDJcdTc1MjhcdTRFOEVcdTU3Mjggdml0ZS5jb25maWcudHMgXHU0RTJEXHU4RkRCXHU4ODRDXHU2NzYxXHU0RUY2XHU2MDI3XHU2M0QyXHU0RUY2XHU5MTREXHU3RjZFXG4gKlxuICogXHU0RjdGXHU3NTI4XHU3OTNBXHU0RjhCXHVGRjFBXG4gKiBgYGB0eXBlc2NyaXB0XG4gKiAvLyBcdTU3Mjggdml0ZS5jb25maWcudHMgXHU0RTJEXG4gKiBwbHVnaW5zOiBbXG4gKiAgIC8vIFx1NEVDNVx1NTcyOCBhcHAgXHU1RTczXHU1M0YwXHU0RTE0XHU1NDJGXHU3NTI4XHU2NUY2XHU3NTFGXHU2NTQ4XG4gKiAgIFVOSV9QTEFURk9STSA9PT0gJ2FwcCdcbiAqICAgICA/IGNyZWF0ZUNvcHlOYXRpdmVSZXNvdXJjZXNQbHVnaW4oXG4gKiAgICAgICAgIFZJVEVfQ09QWV9OQVRJVkVfUkVTX0VOQUJMRSA9PT0gJ3RydWUnLFxuICogICAgICAgICB7IHZlcmJvc2U6IG1vZGUgPT09ICdkZXZlbG9wbWVudCcgfVxuICogICAgICAgKVxuICogICAgIDogbnVsbCxcbiAqIF1cbiAqIGBgYFxuICpcbiAqIEBwYXJhbSBlbmFibGUgXHU2NjJGXHU1NDI2XHU1NDJGXHU3NTI4XHU2M0QyXHU0RUY2XHVGRjBDXHU5MDFBXHU1RTM4XHU5MDFBXHU4RkM3XHU3M0FGXHU1ODgzXHU1M0Q4XHU5MUNGXHU2M0E3XHU1MjM2XG4gKiBAcGFyYW0gb3B0aW9ucyBcdTUxNzZcdTRFRDZcdTkxNERcdTdGNkVcdTkwMDlcdTk4NzlcdUZGMENcdTRFMERcdTUzMDVcdTU0MkIgZW5hYmxlIFx1NUM1RVx1NjAyN1xuICogQHJldHVybnMgVml0ZSBcdTYzRDJcdTRFRjZcdTVCRjlcdThDNjFcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUNvcHlOYXRpdmVSZXNvdXJjZXNQbHVnaW4oXG4gIGVuYWJsZTogYm9vbGVhbiA9IHRydWUsXG4gIG9wdGlvbnM6IE9taXQ8Q29weU5hdGl2ZVJlc291cmNlc09wdGlvbnMsICdlbmFibGUnPiA9IHt9LFxuKTogUGx1Z2luIHtcbiAgcmV0dXJuIGNvcHlOYXRpdmVSZXNvdXJjZXMoeyBlbmFibGUsIC4uLm9wdGlvbnMgfSlcbn1cbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRDpcXFxcaWRlYVxcXFxsb2NrdGVzdFxcXFx5dWRhby11aS1hZG1pbi11bmlhcHAtbWFzdGVyXFxcXHZpdGUtcGx1Z2luc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcaWRlYVxcXFxsb2NrdGVzdFxcXFx5dWRhby11aS1hZG1pbi11bmlhcHAtbWFzdGVyXFxcXHZpdGUtcGx1Z2luc1xcXFxzeW5jLW1hbmlmZXN0LXBsdWdpbnMudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L2lkZWEvbG9ja3Rlc3QveXVkYW8tdWktYWRtaW4tdW5pYXBwLW1hc3Rlci92aXRlLXBsdWdpbnMvc3luYy1tYW5pZmVzdC1wbHVnaW5zLnRzXCI7aW1wb3J0IHR5cGUgeyBQbHVnaW4gfSBmcm9tICd2aXRlJ1xuaW1wb3J0IGZzIGZyb20gJ25vZGU6ZnMnXG5pbXBvcnQgcGF0aCBmcm9tICdub2RlOnBhdGgnXG5pbXBvcnQgcHJvY2VzcyBmcm9tICdub2RlOnByb2Nlc3MnXG5cbmludGVyZmFjZSBNYW5pZmVzdFR5cGUge1xuICAncGx1cyc/OiB7XG4gICAgZGlzdHJpYnV0ZT86IHtcbiAgICAgIHBsdWdpbnM/OiBSZWNvcmQ8c3RyaW5nLCBhbnk+XG4gICAgfVxuICB9XG4gICdhcHAtcGx1cyc/OiB7XG4gICAgZGlzdHJpYnV0ZT86IHtcbiAgICAgIHBsdWdpbnM/OiBSZWNvcmQ8c3RyaW5nLCBhbnk+XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHN5bmNNYW5pZmVzdFBsdWdpbigpOiBQbHVnaW4ge1xuICByZXR1cm4ge1xuICAgIG5hbWU6ICdzeW5jLW1hbmlmZXN0JyxcbiAgICBhcHBseTogJ2J1aWxkJyxcbiAgICBlbmZvcmNlOiAncG9zdCcsXG4gICAgd3JpdGVCdW5kbGU6IHtcbiAgICAgIG9yZGVyOiAncG9zdCcsXG4gICAgICBoYW5kbGVyKCkge1xuICAgICAgICBjb25zdCBzcmNNYW5pZmVzdFBhdGggPSBwYXRoLnJlc29sdmUocHJvY2Vzcy5jd2QoKSwgJy4vc3JjL21hbmlmZXN0Lmpzb24nKVxuICAgICAgICBjb25zdCBkaXN0QXBwUGF0aCA9IHBhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLCAnLi9kaXN0L2Rldi9hcHAvbWFuaWZlc3QuanNvbicpXG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAvLyBcdThCRkJcdTUzRDZcdTZFOTBcdTY1ODdcdTRFRjZcbiAgICAgICAgICBjb25zdCBzcmNNYW5pZmVzdCA9IEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKHNyY01hbmlmZXN0UGF0aCwgJ3V0ZjgnKSkgYXMgTWFuaWZlc3RUeXBlXG5cbiAgICAgICAgICAvLyBcdTc4NkVcdTRGRERcdTc2RUVcdTY4MDdcdTc2RUVcdTVGNTVcdTVCNThcdTU3MjhcbiAgICAgICAgICBjb25zdCBkaXN0QXBwRGlyID0gcGF0aC5kaXJuYW1lKGRpc3RBcHBQYXRoKVxuICAgICAgICAgIGlmICghZnMuZXhpc3RzU3luYyhkaXN0QXBwRGlyKSkge1xuICAgICAgICAgICAgZnMubWtkaXJTeW5jKGRpc3RBcHBEaXIsIHsgcmVjdXJzaXZlOiB0cnVlIH0pXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gXHU4QkZCXHU1M0Q2XHU3NkVFXHU2ODA3XHU2NTg3XHU0RUY2XHVGRjA4XHU1OTgyXHU2NzlDXHU1QjU4XHU1NzI4XHVGRjA5XG4gICAgICAgICAgbGV0IGRpc3RNYW5pZmVzdDogTWFuaWZlc3RUeXBlID0ge31cbiAgICAgICAgICBpZiAoZnMuZXhpc3RzU3luYyhkaXN0QXBwUGF0aCkpIHtcbiAgICAgICAgICAgIGRpc3RNYW5pZmVzdCA9IEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKGRpc3RBcHBQYXRoLCAndXRmOCcpKVxuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIFx1NTk4Mlx1Njc5Q1x1NkU5MFx1NjU4N1x1NEVGNlx1NUI1OFx1NTcyOCBwbHVnaW5zXG4gICAgICAgICAgaWYgKHNyY01hbmlmZXN0WydhcHAtcGx1cyddPy5kaXN0cmlidXRlPy5wbHVnaW5zKSB7XG4gICAgICAgICAgICAvLyBcdTc4NkVcdTRGRERcdTc2RUVcdTY4MDdcdTY1ODdcdTRFRjZcdTRFMkRcdTY3MDlcdTVGQzVcdTg5ODFcdTc2ODRcdTVCRjlcdThDNjFcdTdFRDNcdTY3ODRcbiAgICAgICAgICAgIGlmICghZGlzdE1hbmlmZXN0LnBsdXMpXG4gICAgICAgICAgICAgIGRpc3RNYW5pZmVzdC5wbHVzID0ge31cbiAgICAgICAgICAgIGlmICghZGlzdE1hbmlmZXN0LnBsdXMuZGlzdHJpYnV0ZSlcbiAgICAgICAgICAgICAgZGlzdE1hbmlmZXN0LnBsdXMuZGlzdHJpYnV0ZSA9IHt9XG5cbiAgICAgICAgICAgIC8vIFx1NTkwRFx1NTIzNiBwbHVnaW5zIFx1NTE4NVx1NUJCOVxuICAgICAgICAgICAgZGlzdE1hbmlmZXN0LnBsdXMuZGlzdHJpYnV0ZS5wbHVnaW5zID0gc3JjTWFuaWZlc3RbJ2FwcC1wbHVzJ10uZGlzdHJpYnV0ZS5wbHVnaW5zXG5cbiAgICAgICAgICAgIC8vIFx1NTE5OVx1NTE2NVx1NjZGNFx1NjVCMFx1NTQwRVx1NzY4NFx1NTE4NVx1NUJCOVxuICAgICAgICAgICAgZnMud3JpdGVGaWxlU3luYyhkaXN0QXBwUGF0aCwgSlNPTi5zdHJpbmdpZnkoZGlzdE1hbmlmZXN0LCBudWxsLCAyKSlcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdcdTI3MDUgTWFuaWZlc3QgcGx1Z2lucyBcdTU0MENcdTZCNjVcdTYyMTBcdTUyOUYnKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKCdcdTI3NEMgXHU1NDBDXHU2QjY1IG1hbmlmZXN0IHBsdWdpbnMgXHU1OTMxXHU4RDI1OicsIGVycm9yKVxuICAgICAgICB9XG4gICAgICB9LFxuICAgIH0sXG4gIH1cbn1cbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBaVUsT0FBT0EsV0FBVTtBQUNsVixPQUFPQyxjQUFhO0FBQ3BCLE9BQU8sU0FBUztBQUNoQixPQUFPLGdCQUFnQjtBQUN2QixTQUFTLG1CQUFtQjtBQUU1QixPQUFPLGdCQUFnQjtBQUV2QixPQUFPLGlCQUFpQjtBQUV4QixPQUFPLGNBQWM7QUFHckIsT0FBTyxpQkFBaUI7QUFLeEIsT0FBTyxrQkFBa0I7QUFFekIsT0FBTyxlQUFlO0FBQ3RCLE9BQU8sV0FBVztBQUNsQixTQUFTLGtCQUFrQjtBQUMzQixPQUFPLFlBQVk7QUFDbkIsT0FBTyxnQkFBZ0I7QUFDdkIsU0FBUyxjQUFjLGVBQWU7QUFDdEMsT0FBTyxpQkFBaUI7OztBQzFCeVUsU0FBUyxZQUFZO0FBQ3RYLE9BQU8sUUFBUTtBQUNmLE9BQU8sVUFBVTtBQUNqQixPQUFPLGFBQWE7QUFLcEIsU0FBUyxnQkFBZ0I7QUFDdkIsUUFBTSxXQUFXLFFBQVE7QUFDekIsUUFBTSxFQUFFLGFBQWEsSUFBSSxRQUFRO0FBRWpDLFFBQU0sa0JBQWtCLGlCQUFpQixjQUFjLG1DQUFVLGlCQUFpQixjQUFjLHlDQUFXO0FBRzNHLFFBQU0sY0FBYyxLQUFLLFFBQVEsUUFBUSxJQUFJLEdBQUcsWUFBWSxZQUFZLEVBQUU7QUFHMUUsTUFBSSxDQUFDLEdBQUcsV0FBVyxXQUFXLEdBQUc7QUFDL0IsWUFBUSxJQUFJLFVBQUssZUFBZSwrQ0FBWSxXQUFXO0FBQ3ZEO0FBQUEsRUFDRjtBQUVBLFVBQVEsSUFBSSxxQ0FBVSxlQUFlLG1DQUFVO0FBRy9DLE1BQUksVUFBVTtBQUVkLE1BQUksYUFBYSxVQUFVO0FBRXpCLFFBQUksaUJBQWlCLGFBQWE7QUFDaEMsZ0JBQVUsOERBQThELFdBQVc7QUFBQSxJQUNyRixXQUNTLGlCQUFpQixhQUFhO0FBQ3JDLGdCQUFVLDJJQUEyRCxXQUFXO0FBQUEsSUFDbEY7QUFBQSxFQUNGLFdBQ1MsYUFBYSxXQUFXLGFBQWEsU0FBUztBQUVyRCxRQUFJLGlCQUFpQixhQUFhO0FBQ2hDLGdCQUFVLGtHQUErRCxXQUFXO0FBQUEsSUFDdEY7QUFBQSxFQUNGLE9BQ0s7QUFFSCxZQUFRLElBQUkscUhBQXNCO0FBQ2xDO0FBQUEsRUFDRjtBQUVBLE9BQUssU0FBUyxDQUFDLE9BQU8sUUFBUSxXQUFXO0FBQ3ZDLFFBQUksT0FBTztBQUNULGNBQVEsSUFBSSxzQkFBTyxlQUFlLCtDQUFZLE1BQU0sT0FBTztBQUMzRCxjQUFRLElBQUksK0JBQVMsZUFBZSwwRUFBYztBQUNsRCxjQUFRLElBQUksaURBQVksZUFBZSxpRUFBZSxXQUFXO0FBQ2pFO0FBQUEsSUFDRjtBQUVBLFFBQUksUUFBUTtBQUNWLGNBQVEsSUFBSSw4QkFBVSxNQUFNO0FBQUEsSUFDOUI7QUFFQSxZQUFRLElBQUksVUFBSyxlQUFlLGtEQUFVO0FBRTFDLFFBQUksUUFBUTtBQUNWLGNBQVEsSUFBSSxNQUFNO0FBQUEsSUFDcEI7QUFBQSxFQUNGLENBQUM7QUFDSDtBQUVlLFNBQVIsZUFBZ0M7QUFFckMsTUFBSSxlQUFlO0FBRW5CLFNBQU87QUFBQSxJQUNMLE1BQU07QUFBQSxJQUNOLGNBQWM7QUFDWixVQUFJLGdCQUFnQixRQUFRLElBQUksY0FBYyxTQUFTLElBQUksR0FBRztBQUM1RCx1QkFBZTtBQUNmLHNCQUFjO0FBQUEsTUFDaEI7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGOzs7QUNqRkEsT0FBT0MsV0FBVTtBQUNqQixPQUFPQyxjQUFhO0FBQ3BCLE9BQU9DLFNBQVE7QUFtQ2YsSUFBTSxrQkFBd0Q7QUFBQSxFQUM1RCxRQUFRO0FBQUEsRUFDUixXQUFXO0FBQUEsRUFDWCxlQUFlO0FBQUEsRUFDZixTQUFTO0FBQUEsRUFDVCxXQUFXO0FBQ2I7QUF1Qk8sU0FBUyxvQkFBb0IsVUFBc0MsQ0FBQyxHQUFXO0FBQ3BGLFFBQU0sU0FBUyxFQUFFLEdBQUcsaUJBQWlCLEdBQUcsUUFBUTtBQUdoRCxNQUFJLENBQUMsT0FBTyxRQUFRO0FBQ2xCLFdBQU87QUFBQSxNQUNMLE1BQU07QUFBQSxNQUNOLE9BQU87QUFBQSxNQUNQLGNBQWM7QUFBQSxNQUVkO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFFQSxTQUFPO0FBQUEsSUFDTCxNQUFNO0FBQUEsSUFDTixPQUFPO0FBQUE7QUFBQSxJQUNQLFNBQVM7QUFBQTtBQUFBLElBRVQsTUFBTSxjQUFjO0FBQ2xCLFlBQU0sRUFBRSxXQUFXLGVBQWUsU0FBUyxVQUFVLElBQUk7QUFFekQsVUFBSTtBQUVGLGNBQU0sY0FBY0MsU0FBUSxJQUFJO0FBR2hDLGNBQU0sYUFBYUMsTUFBSyxRQUFRLGFBQWEsU0FBUztBQUt0RCxjQUFNLFlBQVlELFNBQVEsSUFBSSxhQUFhLGVBQWUsVUFBVTtBQUNwRSxjQUFNLFdBQVdBLFNBQVEsSUFBSSxnQkFBZ0I7QUFDN0MsY0FBTSxhQUFhQyxNQUFLO0FBQUEsVUFDdEI7QUFBQSxVQUNBO0FBQUEsVUFDQTtBQUFBLFVBQ0E7QUFBQSxVQUNBO0FBQUEsUUFDRjtBQUlBLGNBQU0sZUFBZSxNQUFNQyxJQUFHLFdBQVcsVUFBVTtBQUNuRCxZQUFJLENBQUMsY0FBYztBQUNqQixjQUFJLFNBQVM7QUFDWCxvQkFBUSxLQUFLLEdBQUcsU0FBUyxpRkFBZ0I7QUFDekMsb0JBQVEsS0FBSyxHQUFHLFNBQVMsb0NBQVcsVUFBVSxFQUFFO0FBQ2hELG9CQUFRLEtBQUssR0FBRyxTQUFTLHNKQUF3QztBQUNqRSxvQkFBUSxLQUFLLEdBQUcsU0FBUyw2RkFBa0I7QUFDM0Msb0JBQVEsS0FBSyxHQUFHLFNBQVMsdUVBQTZEO0FBQUEsVUFDeEY7QUFDQTtBQUFBLFFBQ0Y7QUFJQSxjQUFNLGNBQWMsTUFBTUEsSUFBRyxRQUFRLFVBQVU7QUFDL0MsWUFBSSxZQUFZLFdBQVcsR0FBRztBQUM1QixjQUFJLFNBQVM7QUFDWCxvQkFBUSxLQUFLLEdBQUcsU0FBUywyRUFBZTtBQUN4QyxvQkFBUSxLQUFLLEdBQUcsU0FBUyxvQ0FBVyxVQUFVLEVBQUU7QUFDaEQsb0JBQVEsS0FBSyxHQUFHLFNBQVMsZ0dBQStCO0FBQUEsVUFDMUQ7QUFDQTtBQUFBLFFBQ0Y7QUFHQSxjQUFNQSxJQUFHLFVBQVUsVUFBVTtBQUU3QixZQUFJLFNBQVM7QUFDWCxrQkFBUSxJQUFJLEdBQUcsU0FBUywwRUFBd0I7QUFDaEQsa0JBQVEsSUFBSSxHQUFHLFNBQVMsd0JBQVMsVUFBVSxFQUFFO0FBQzdDLGtCQUFRLElBQUksR0FBRyxTQUFTLDhCQUFVLFVBQVUsRUFBRTtBQUM5QyxrQkFBUSxJQUFJLEdBQUcsU0FBUyw4QkFBVSxTQUFTLEVBQUU7QUFDN0Msa0JBQVEsSUFBSSxHQUFHLFNBQVMsOEJBQVUsUUFBUSxFQUFFO0FBQzVDLGtCQUFRLElBQUksR0FBRyxTQUFTLGlCQUFPLFlBQVksTUFBTSwwREFBYTtBQUFBLFFBQ2hFO0FBSUEsY0FBTUEsSUFBRyxLQUFLLFlBQVksWUFBWTtBQUFBLFVBQ3BDLFdBQVc7QUFBQTtBQUFBLFVBQ1gsY0FBYztBQUFBO0FBQUEsVUFDZCxvQkFBb0I7QUFBQTtBQUFBLFFBQ3RCLENBQUM7QUFFRCxZQUFJLFNBQVM7QUFDWCxrQkFBUSxJQUFJLEdBQUcsU0FBUyw2RUFBc0I7QUFDOUMsa0JBQVEsSUFBSSxHQUFHLFNBQVMsbUNBQVUsWUFBWSxNQUFNLGdFQUFjO0FBQ2xFLGtCQUFRLElBQUksR0FBRyxTQUFTLDRGQUFzQjtBQUFBLFFBQ2hEO0FBQUEsTUFDRixTQUNPLE9BQU87QUFDWixnQkFBUSxNQUFNLEdBQUcsT0FBTyxTQUFTLGlGQUEwQixLQUFLO0FBQ2hFLGdCQUFRLE1BQU0sR0FBRyxPQUFPLFNBQVMsOEJBQVUsaUJBQWlCLFFBQVEsTUFBTSxVQUFVLE9BQU8sS0FBSyxDQUFDO0FBQ2pHLGdCQUFRLE1BQU0sR0FBRyxPQUFPLFNBQVMsaUZBQWdCO0FBQUEsTUFFbkQ7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGO0FBMEJPLFNBQVMsZ0NBQ2QsU0FBa0IsTUFDbEIsVUFBc0QsQ0FBQyxHQUMvQztBQUNSLFNBQU8sb0JBQW9CLEVBQUUsUUFBUSxHQUFHLFFBQVEsQ0FBQztBQUNuRDs7O0FDdk1BLE9BQU9DLFNBQVE7QUFDZixPQUFPQyxXQUFVO0FBQ2pCLE9BQU9DLGNBQWE7QUFlTCxTQUFSLHFCQUE4QztBQUNuRCxTQUFPO0FBQUEsSUFDTCxNQUFNO0FBQUEsSUFDTixPQUFPO0FBQUEsSUFDUCxTQUFTO0FBQUEsSUFDVCxhQUFhO0FBQUEsTUFDWCxPQUFPO0FBQUEsTUFDUCxVQUFVO0FBQ1IsY0FBTSxrQkFBa0JDLE1BQUssUUFBUUMsU0FBUSxJQUFJLEdBQUcscUJBQXFCO0FBQ3pFLGNBQU0sY0FBY0QsTUFBSyxRQUFRQyxTQUFRLElBQUksR0FBRyw4QkFBOEI7QUFFOUUsWUFBSTtBQUVGLGdCQUFNLGNBQWMsS0FBSyxNQUFNQyxJQUFHLGFBQWEsaUJBQWlCLE1BQU0sQ0FBQztBQUd2RSxnQkFBTSxhQUFhRixNQUFLLFFBQVEsV0FBVztBQUMzQyxjQUFJLENBQUNFLElBQUcsV0FBVyxVQUFVLEdBQUc7QUFDOUIsWUFBQUEsSUFBRyxVQUFVLFlBQVksRUFBRSxXQUFXLEtBQUssQ0FBQztBQUFBLFVBQzlDO0FBR0EsY0FBSSxlQUE2QixDQUFDO0FBQ2xDLGNBQUlBLElBQUcsV0FBVyxXQUFXLEdBQUc7QUFDOUIsMkJBQWUsS0FBSyxNQUFNQSxJQUFHLGFBQWEsYUFBYSxNQUFNLENBQUM7QUFBQSxVQUNoRTtBQUdBLGNBQUksWUFBWSxVQUFVLEdBQUcsWUFBWSxTQUFTO0FBRWhELGdCQUFJLENBQUMsYUFBYTtBQUNoQiwyQkFBYSxPQUFPLENBQUM7QUFDdkIsZ0JBQUksQ0FBQyxhQUFhLEtBQUs7QUFDckIsMkJBQWEsS0FBSyxhQUFhLENBQUM7QUFHbEMseUJBQWEsS0FBSyxXQUFXLFVBQVUsWUFBWSxVQUFVLEVBQUUsV0FBVztBQUcxRSxZQUFBQSxJQUFHLGNBQWMsYUFBYSxLQUFLLFVBQVUsY0FBYyxNQUFNLENBQUMsQ0FBQztBQUNuRSxvQkFBUSxJQUFJLGtEQUF5QjtBQUFBLFVBQ3ZDO0FBQUEsUUFDRixTQUNPLE9BQU87QUFDWixrQkFBUSxNQUFNLHNEQUE2QixLQUFLO0FBQUEsUUFDbEQ7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRjs7O0FIbkNBLElBQU8sc0JBQVEsYUFBYSxDQUFDLEVBQUUsU0FBUyxLQUFLLE1BQU07QUFNakQsVUFBUSxJQUFJLHFCQUFxQixTQUFTLElBQUk7QUFTOUMsUUFBTSxFQUFFLGFBQWEsSUFBSUMsU0FBUTtBQUNqQyxVQUFRLElBQUksb0JBQW9CLFlBQVk7QUFFNUMsUUFBTSxNQUFNLFFBQVEsTUFBTUMsTUFBSyxRQUFRRCxTQUFRLElBQUksR0FBRyxLQUFLLENBQUM7QUFDNUQsUUFBTTtBQUFBLElBQ0o7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsRUFDRixJQUFJO0FBQ0osVUFBUSxJQUFJLG9DQUFnQixHQUFHO0FBRS9CLFNBQU8sYUFBYTtBQUFBLElBQ2xCLFFBQVE7QUFBQTtBQUFBLElBQ1IsTUFBTTtBQUFBLElBQ04sU0FBUztBQUFBLE1BQ1AsV0FBVztBQUFBLE1BQ1gsWUFBWTtBQUFBLE1BQ1osWUFBWTtBQUFBLE1BQ1osU0FBUztBQUFBLFFBQ1AsU0FBUyxDQUFDLHVCQUF1QjtBQUFBO0FBQUE7QUFBQSxRQUdqQyxhQUFhO0FBQUEsVUFDWDtBQUFBO0FBQUEsVUFDQTtBQUFBO0FBQUEsVUFDQTtBQUFBO0FBQUEsVUFDQTtBQUFBO0FBQUEsVUFDQTtBQUFBO0FBQUEsUUFDRjtBQUFBLFFBQ0EsS0FBSztBQUFBLE1BQ1AsQ0FBQztBQUFBO0FBQUEsTUFFRCxhQUFhO0FBQUEsUUFDWCxRQUFRO0FBQUEsVUFDTixnQkFBZ0I7QUFBQSxVQUNoQixnQkFBZ0I7QUFBQSxVQUNoQixtQkFBbUI7QUFBQSxRQUNyQjtBQUFBLFFBQ0EsS0FBSztBQUFBLFVBQ0gsTUFBTTtBQUFBLFFBQ1I7QUFBQSxRQUNBLFFBQVE7QUFBQSxNQUNWLENBQUM7QUFBQTtBQUFBO0FBQUEsTUFHRCxVQUFVO0FBQUEsUUFDUixjQUFjLENBQUMsdUJBQXVCO0FBQUEsTUFDeEMsQ0FBQztBQUFBO0FBQUEsTUFFRCxXQUFXO0FBQUEsUUFDVCxZQUFZLENBQUMsS0FBSztBQUFBLFFBQ2xCLE1BQU07QUFBQTtBQUFBLFFBQ04sc0JBQXNCO0FBQUE7QUFBQSxRQUN0QixLQUFLO0FBQUE7QUFBQSxNQUNQLENBQUM7QUFBQSxNQUNELElBQUk7QUFBQSxNQUNKO0FBQUE7QUFBQTtBQUFBO0FBQUEsUUFJRSxNQUFNO0FBQUEsUUFDTixlQUFlLFFBQVE7QUFDckIsZ0JBQU0sU0FBUyxPQUFPLFFBQVEsS0FBSyxPQUFLLEVBQUUsU0FBUyxVQUFVO0FBQzdELGNBQUksVUFBVSxPQUFPLE9BQU8sT0FBTyxJQUFJLFNBQVM7QUFDOUMsbUJBQU8sSUFBSSxRQUFRLGtCQUFrQjtBQUFBLFVBQ3ZDO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxNQUNBLE9BQU87QUFBQSxNQUNQLFdBQVc7QUFBQSxRQUNULFNBQVMsQ0FBQyxPQUFPLFNBQVM7QUFBQSxRQUMxQixLQUFLO0FBQUEsUUFDTCxNQUFNLENBQUMsV0FBVztBQUFBO0FBQUEsUUFDbEIsYUFBYTtBQUFBO0FBQUEsTUFDZixDQUFDO0FBQUEsTUFDRCxZQUFZO0FBQUE7QUFBQSxRQUVWLFNBQVMsQ0FBQyxnQkFBZ0I7QUFBQSxNQUM1QixDQUFDO0FBQUE7QUFBQSxNQUVELGlCQUFpQixRQUFRO0FBQUEsUUFDdkIsTUFBTTtBQUFBLFFBQ04sbUJBQW1CLE1BQU07QUFDdkIsaUJBQU8sS0FBSyxRQUFRLGdCQUFnQixNQUFNLEVBQUUsT0FBTyxxQkFBcUIsQ0FBQyxFQUFFLFFBQVEsb0JBQW9CLGNBQWM7QUFBQSxRQUN2SDtBQUFBLE1BQ0Y7QUFBQTtBQUFBLE1BRUEsaUJBQWlCLFFBQ2QsU0FBUyxnQkFDVCxXQUFXO0FBQUEsUUFDWixVQUFVO0FBQUEsUUFDVixNQUFNO0FBQUEsUUFDTixVQUFVO0FBQUEsUUFDVixZQUFZO0FBQUEsTUFDZCxDQUFDO0FBQUE7QUFBQSxNQUVEO0FBQUEsUUFDRSxpQkFBaUIsU0FBUyxnQ0FBZ0M7QUFBQSxRQUMxRDtBQUFBLFVBQ0UsU0FBUyxTQUFTO0FBQUE7QUFBQSxRQUNwQjtBQUFBLE1BQ0Y7QUFBQSxNQUNBLG1CQUFtQjtBQUFBLE1BQ25CLFdBQVc7QUFBQSxRQUNULFdBQVcsQ0FBQyxZQUFZLENBQUM7QUFBQSxRQUN6QixZQUFZLENBQUMsS0FBSztBQUFBLFFBQ2xCLE1BQU07QUFBQTtBQUFBLFFBQ04sc0JBQXNCO0FBQUE7QUFBQSxRQUN0QixLQUFLO0FBQUE7QUFBQSxNQUNQLENBQUM7QUFBQTtBQUFBLE1BRUQsYUFBYTtBQUFBLElBQ2Y7QUFBQSxJQUNBLFFBQVE7QUFBQSxNQUNOLG9CQUFvQixLQUFLLFVBQVUscUJBQXFCO0FBQUEsSUFDMUQ7QUFBQSxJQUNBLEtBQUs7QUFBQSxNQUNILFNBQVM7QUFBQSxRQUNQLFNBQVM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFFBS1Q7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLElBRUEsU0FBUztBQUFBLE1BQ1AsT0FBTztBQUFBLFFBQ0wsS0FBS0MsTUFBSyxLQUFLRCxTQUFRLElBQUksR0FBRyxPQUFPO0FBQUEsUUFDckMsUUFBUUMsTUFBSyxLQUFLRCxTQUFRLElBQUksR0FBRyxxQkFBcUI7QUFBQSxNQUN4RDtBQUFBLElBQ0Y7QUFBQSxJQUNBLFFBQVE7QUFBQSxNQUNOLE1BQU07QUFBQSxNQUNOLEtBQUs7QUFBQSxNQUNMLE1BQU0sT0FBTyxTQUFTLGVBQWUsRUFBRTtBQUFBO0FBQUEsTUFFdkMsT0FBTyxLQUFLLE1BQU0scUJBQXFCLElBQ25DO0FBQUEsUUFDRSxDQUFDLHFCQUFxQixHQUFHO0FBQUEsVUFDdkIsUUFBUTtBQUFBLFVBQ1IsY0FBYztBQUFBO0FBQUEsVUFFZCxTQUFTLENBQUFDLFVBQVFBLE1BQUssUUFBUSxJQUFJLE9BQU8sSUFBSSxxQkFBcUIsRUFBRSxHQUFHLEVBQUU7QUFBQSxRQUMzRTtBQUFBLE1BQ0YsSUFDQTtBQUFBLElBQ047QUFBQSxJQUNBLFNBQVM7QUFBQSxNQUNQLE1BQU0sd0JBQXdCLFNBQVMsQ0FBQyxXQUFXLFVBQVUsSUFBSSxDQUFDO0FBQUEsSUFDcEU7QUFBQSxJQUNBLE9BQU87QUFBQSxNQUNMLFdBQVc7QUFBQTtBQUFBO0FBQUEsTUFHWCxRQUFRO0FBQUE7QUFBQSxNQUVSLFFBQVEsU0FBUyxnQkFBZ0IsUUFBUTtBQUFBLElBQzNDO0FBQUEsRUFDRixDQUFDO0FBQ0gsQ0FBQzsiLAogICJuYW1lcyI6IFsicGF0aCIsICJwcm9jZXNzIiwgInBhdGgiLCAicHJvY2VzcyIsICJmcyIsICJwcm9jZXNzIiwgInBhdGgiLCAiZnMiLCAiZnMiLCAicGF0aCIsICJwcm9jZXNzIiwgInBhdGgiLCAicHJvY2VzcyIsICJmcyIsICJwcm9jZXNzIiwgInBhdGgiXQp9Cg==
