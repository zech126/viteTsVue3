import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from "@vitejs/plugin-vue-jsx"; // 用于支持 vueJsx 文件打包
import codecompression  from "vite-plugin-codecompression"; // 压缩代码，生成 .gz 格式并将输出目录打包成 zip 包
// import topLevelAwait from "vite-plugin-top-level-await"; // 用于支持顶级使用 await

const path = require('path');
// 输出目录
const projectName = 'dist';
const assetsName = 'static';

export default defineConfig(({command, mode}) => {
  // 是否将输出文件夹打包为 zip 包
  const outputZip = ['prod'].includes(mode);
  /* 
    获取环境变量需要使用 loadEnv 方法，第一个是.env后面的名字，第二个是绝对路径，第三个参数是你环境变量名的前缀，在vite中默认是VITE_，
    注意：需要 import { defineConfig, loadEnv} from 'vite' 引入 
    const env = loadEnv(mode, './evnConfig/', 'VITE_');
  */
  return {
    plugins: [
      vue(),
      vueJsx(),
      // topLevelAwait({
      //   // 每个块模块的顶级 await promise 的导出名称
      //   promiseExportName: "__tla",
      //   // 在每个chunk模块中生成顶级 await promise 的导入名称的函数
      //   promiseImportName: i => `__tla_${i}`
      // }),
      codecompression({
        fileZip: {
          disable: !outputZip
        }
      })
    ],
    root: process.cwd(),
    base: "./",
    //控制台输出的级别 info 、warn、error、silent
    logLevel: "info",
    // 设为false 可以避免 vite 清屏而错过在终端中打印某些关键信息
    // clearScreen:true,
    // 用于加载 env 文件的目录。可以是一个绝对路径，也可以是相对于项目根的路径。默认 root
    envDir: './evnConfig/',
    // 自定义 env 变量的前缀
    // envPrefix: [],
    // 配置文件别名
    resolve: {
      // 忽略文件导入后缀名称（设置之将覆盖默认设置，建议使用默认）
      // extensions: ['.js', '.vue', '.json', 'jsx'],
      // 使用别名并且TS框架时，需要到到 tsconfig.js 文件配置 path 属性自定义引入的路径
      alias: [
        // 图片文件别名
        { find: '@images', replacement: path.resolve(__dirname, './src/assets/images') },
        // src 根目录别名
        { find: '@', replacement: path.resolve(__dirname, './src') },
        { find: '@views', replacement: path.resolve(__dirname, './src/views') },
        { find: '$common', replacement: path.resolve(__dirname, './src/utils/common.ts') },
        { find: '$request', replacement: path.resolve(__dirname, './src/utils/request.ts') }
      ]
    },
    // 打包配置
    build: {
      //浏览器兼容性  "esnext"|"modules"
      target: "modules",
      outDir: `${projectName}`, //指定输出路径
      assetsDir: assetsName, // 指定生成静态资源的存放路径
      // 打包文件设置
      rollupOptions: {
        // 入口文件配置
        input: {
          index: path.resolve(__dirname, "index.html")
          // project: path.resolve(__dirname,"project.html")
        },
        // 输出
        output: {
          chunkFileNames: `${assetsName}/js/[name]-[hash].js`,
          entryFileNames: `${assetsName}/js/[name]-[hash].js`,
          assetFileNames: `${assetsName}/[name]-[hash].[ext]`,
          manualChunks(directory) {
            if (directory.includes('node_modules')) {
              return directory.toString().split('node_modules/')[1].split('/')[0].toString();
            }
          }
        }
      },
      // @rollup/plugin-commonjs 插件的选项
      commonjsOptions: {},
      //当设置为 true，构建后将会生成 manifest.json 文件
      // manifest: false,
      /* 
        设置为 false 可以禁用最小化混淆，
        或是用来指定使用哪种混淆器, terser 构建后文件体积更小
        boolean | 'terser' | 'esbuild'
      */
      minify: "terser",
      //传递给 Terser 的更多 minify 选项。
      terserOptions: {
        // 清除 console 和 debugger
        compress: {
          drop_console: true,
          drop_debugger: true
        },
        // keep_classnames: true
      },
    },
    server: {
      host: '0.0.0.0',
      port: 8456,
      // https: false, // 是否启用 http 2
      cors: true, // 为开发服务器配置 CORS , 默认启用并允许任何源
      open: true, // 在服务器启动时自动在浏览器中打开应用程序
      strictPort: false, // 设为true时端口被占用则直接退出，不会尝试下一个可用端口
      // force: true, // 是否强制依赖预构建
      hmr: { overlay: true },
      // 传递给 chockidar 的文件系统监视器选项
      // watch: {
      //   ignored:["!**/node_modules/your-package-name/**"]
      // },
      // 反向代理配置，注意 rewrite 写法
      // proxy: {
      //     '/api': {
      //     target: 'http://192.168.0.2:8080', 
      //     changeOrigin: true,
      //     rewrite: (path) => path.replace(/^\/api/, '')
      //   }
      // }
    },
    // 强制预构建插件包
    optimizeDeps: {
      // 检测需要预构建的依赖项
      entries: [],
      // 默认情况下，不在 node_modules 中的，链接的包不会预构建
      // include: [
      //   'vue', 'axios', 'nprogress', 'vue-router', 'vuex', 'element-plus', 'js-cookie', '@element-plus/icons-vue',
      //   'dayjs'
      // ],
      include: [],
      // exclude:['your-package-name'] //排除在优化之外
    },
    css: {
      // 配置 css modules 的行为
      modules: {},
      // postCss 配置
      postcss: {},
      //指定传递给 css 预处理器的选项
      preprocessorOptions: {
        // less 全局变量
        // less: {
        //   javascriptEnabled: true,
        //   additionalData: `@import "${path.resolve(__dirname, 'src/assets/style/variable.less')}";`
        // },
        // scss 全局变量
        // scss: {
        //   javascriptEnabled: true,
        //   additionalData: '@import "./src/assets/style/variables.scss";'
        // }
      }
    },
    json: {
      //是否支持从 .json 文件中进行按名导入
      namedExports: true,
      //若设置为 true 导入的json会被转为 export default JSON.parse("..") 会比转译成对象字面量性能更好
      stringify: false
    },
     //继承自 esbuild 转换选项，最常见的用例是自定义 JSX
    esbuild: {
      jsxFactory: "h",
      jsxFragment: "Fragment",
      jsxInject:`import Vue from 'vue'`
    },
  }
})
