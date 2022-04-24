/// <reference types="vite/client" />
import { AxiosInstance } from "axios";
//全局配置（typescript使用）
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $http: AxiosInstance;
    $dayjs: Function;
    $common: any;
    $message: any;
    api: any;
    $api: any;
    $refs: any;
    $attrs: any;
    $emit: any;
    $parent: any;
  }
}
// 新增 axios 配置
declare module 'axios' {
  interface AxiosRequestConfig {
    removeEmpty?: boolean;
    hiddenError?: boolean;
  }
}
// 环境变量
interface ImportMetaEnv {
  VITE_CONFIG: string;
  VITE_SYSTEMCODE: string;
  VITE_AUTH: string;
  VITE_BASEURL: string;
}

interface MinifyOptions {
  dropConsole: boolean;
  dropDebugger: boolean;
}

declare module '*.svg';
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.bmp';
declare module '*.tiff';

