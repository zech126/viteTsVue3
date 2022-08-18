::: tip 注意
  [viteTsVue3](https://github.com/zech126/viteTsVue3) 是使用 
  [vite](https://cn.vitejs.dev/config/#clearscreen) + 
  [vue3](https://staging-cn.vuejs.org/) + 
  [typescript](https://www.typescriptlang.org/)
  [(中文)](http://www.patrickzhong.com/TypeScript/) + 
  [element-plus](https://element-plus.org/zh-CN/component/button.html) 
  简单做的功能页面,下面将会介绍文档构成以及简单使用
:::

# 目录结构
```js
|-- 项目文件夹
     |-- .husky 用于提交代码时进行执行 eslint 验证
     |-- .vscode vscode 编辑器使用的配置， 可忽略
     |-- public 静态文件存放置
     |-- .eslintignore eslint 验证忽略文件配置
     |-- .eslintrc.js eslint 验证配置
     |-- .gitignore 提交忽略文件配置
     |-- index.html 项目web页面入口
     |-- package.json 项目依赖安装文件
     |-- README.md   项目文档
     |-- tsconfig.json vscode 代码检查配置
     |-- tsconfig.node.json node 代码运行配置，可忽略
     |-- vite.config.ts 项目打包以及运行配置
     |-- evnConfig 环境变量配置
     |    |-- .env.dev  开发环境配置
     |    |-- .env.test 测试环境配置
     |    |-- .env.pre  预发布环境
     |    |-- .env.prod 生产环境配置
     |-- src 项目代码存放位置
          |-- api api 文件设置
          |    |-- index.ts API 主要入口
          |    |-- globalApi.ts 全局 API 入口
          |-- assets 资源文件存放位置
          |    |-- images 图片存放位置
          |    |-- iconFont 字体图标存放位置
          |    |-- style 式文件存放位置
          |         |-- index.less 全局样式
          |         |-- variable.less 全局样式变量
          |         |-- variables.scss 全局样式变量
          |-- components 自定义组件
          |     |-- index.ts 组件注册设置
          |-- config.d.ts 类型定义存放位置
          |     |-- vue.d.ts 部分公共类型定义
          |-- layout 布局视图
          |-- router 路由配置
          |    |-- index.ts 路由设置以验证
          |    |-- pageRouter.ts 页面视图路由入口
          |    |-- storeConfig.ts 路由 VUEX 设置
          |-- store vuex 配置
          |    |-- index.ts 页面视图VUEX入口
          |    |-- storeGetters.ts VUEX 的 getter 方法设置
          |-- utils 工具脚本存放文件夹
          |-- App.vue 项目主页
          |-- main.ts 项目主入口
          |-- views 页面视图
               |-- 业务页面模块存放位置
                      |-- apiConfig.ts 当前业务 API 配置
                      |-- routerConfig.ts 当前业务路由配置
                      |-- storeConfig.ts 当前业务 VUEX 配置
                      |-- page 当前业务页面视图存放位置
```
## 开始我的页面
1、在 views 下新建 testView 文件夹   
2、在 testView 新建 routerConfig.ts、 apiConfig.ts(不使用到api忽略此文件)、 storeConfig.ts(不使用到vuex忽略此文件)文件以 page 文件夹   
3、在 page 新建 myPage.vue   
4、在 myPage.vue 随便写点东西   
```html
<template>
  <div style="padding: 60px">
    我的页面; 当前时间：{{data.nowTime}}
  </div>
</template>
```
```js
<script lang="ts" setup>
import { reactive } from 'vue';
const data = reactive({
  nowTime: ''
})
const getNowTime () {
  const nTime = new Date();
  const year = nTime.getFullYear();
  const month = nTime.getMonth() + 1;
  const date = nTime.getDate();
  const hours = nTime.getHours();
  const minutes = nTime.getMinutes();
  const seconds = nTime.getSeconds();
  data.nowTime = `
    ${year}-${month >= 10 ? month : `0${month}`}-${date >= 10 ? date : `0${date}`} 
    ${hours >= 10 ? hours : `0${hours}`}:${minutes >= 10 ? minutes : `0${minutes}`}:${seconds >= 10 ? seconds : `0${seconds}`}
  `;
}
getNowTime();
setTimeout(() => {
  getNowTime();
}, 1000)
<script>
```
5、在 views 模块目录下新建 routerConfig.ts；示例配置路由
```js
const routes = [
  {
    name: "我的页面",
    path: "/myPage",
    component: () => import("./page/myPage.vue"),
    meta: { requireAuth: false, keepAlive: false }
  }
];
export default routes;
```
::: tip 需要用到 api 时在 views 模块目录下新建 apiConfig.ts；示例配置
  ```js
  export default {
    testApi: {
      selectUserInfo: '/dyt-cloud-upms-admin/sys/user/userInfoList'
    },
  }
  ```
  *<font color=#FF0000>注意: 当其他 apiConfig.ts 和 globalApi 存在相同 key 时，会被 globalApi 覆盖</font>*   
  全局 API 可以在 src/api 下的 globalApi.ts 配置;示例
  ```js
     export default {
      apiTest: {
        api1: '/globa/api1',
        api2: '/globa/api2',
      },
    }
  ```
  API 使用, 在使用 
  ```js
  this.api.xxxx;
  // 在 <script lang="ts" setup> 标签下时
  import getGlobal from '@/utils/global';
  const global = getGlobal();
  global.api.xxxx;
  /* 在 <script lang="ts" setup> 标签下时; 
    global 会返回所有挂载到 vue 的对象或变量
    还是需要用到 this.$refs 可使用 
    import getProxy from '@/utils/proxy';
    const proxy:{[key:string]: any} = getProxy();
    proxy.$refs 代替
  */
```

:::

::: tip 需要用到 vuex 时在 views 模块目录下新建 storeConfig.ts；示例配置
  ```js
  export default {
    moduleName: "testPage",
    state: {
      exitWebOauth: false,
    },
    mutations: {
      exitWebOauth(state:any, data:any) {
        state.exitWebOauth = data;
      },
    },
    actions: {},
    getters: {
      exitWebOauth: (state:any) => {
        return state.exitWebOauth;
      },
    }
  }
  ```
  页面中使用 store； 示例：
   ```js
    // 更改或插入值
    this.$store.commit('testPage/exitWebOauth', true);
    // 获取值
    this.$store.getters['testPage/exitWebOauth'];
    // 在 <script lang="ts" setup> 标签下时
    import store from "@/store";
    // 或
    import { useStore } from "vuex";
    const store = useStore();
    // 更改或插入值
    store.commit('testPage/exitWebOauth', true);
    // 获取值
    const exitWebOauth = store.getters['testPage/exitWebOauth'];

  ```
  :::

## 开始我的组件
1、在 src\components 下新建 myComponent 文件夹   
2、在 myComponent 新建 index.ts、 myComponent.vue 文件(如果不注册为全局组件，请删除 index.ts )     

::: tip myComponent.vue 文件示例：
  ```html
    <template>
      <div>
        我是组件；当前时间：{{data.nowTime}}; 传过来的参数：{{props.optins}}
      </div>
    </template>
  ```
  
  ```js
    <script lang="ts" setup>
      import { reactive } from 'vue';
      const props = defineProps({
        optins: { type: String, default: '' }
      });
      const data = reactive({
        nowTime: ''
      })
      const getNowTime () {
        const nTime = new Date();
        const year = nTime.getFullYear();
        const month = nTime.getMonth() + 1;
        const date = nTime.getDate();
        const hours = nTime.getHours();
        const minutes = nTime.getMinutes();
        const seconds = nTime.getSeconds();
        data.nowTime = `
          ${year}-${month >= 10 ? month : `0${month}`}-${date >= 10 ? date : `0${date}`} 
          ${hours >= 10 ? hours : `0${hours}`}:${minutes >= 10 ? minutes : `0${minutes}`}:${seconds >= 10 ? seconds : `0${seconds}`}
        `;
      }
      getNowTime();
      setTimeout(() => {
        getNowTime();
      }, 1000)
    <script>
  ```
  更多组件写法请参考 [VUE3-components](https://staging-cn.vuejs.org/guide/essentials/component-basics.html)
  或 [组合式 API](https://staging-cn.vuejs.org/guide/typescript/composition-api.html)
  或 [选项式 API](https://staging-cn.vuejs.org/guide/typescript/options-api.html)
:::

::: tip index.ts 文件示例；如果不注册为全局组件，请删除 index.ts
  ```js
  import myComponent from './myComponent.vue';
  export default myComponent;
  ```
:::


