/// <reference types="vite/client" />
import { AxiosInstance } from "axios";
import type { commonClass } from "../utils/common";
//全局配置（typescript使用）
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $http: AxiosInstance;
    $common: commonClass,
    localforage: LocalForage;
    api: {[key:string]: any};
    $api: {[key:string]: any};
    $refs: Array<any> | {[key: string]: any};
    $message: any;
    $dayjs: any;
    $attrs: any;
    $emit: any;
    $parent: any;
    [key:string]: any;
  }
}
// 新增 axios 配置
declare module 'axios' {
  interface AxiosRequestConfig {
    removeEmpty?: boolean;
    hiddenError?: boolean;
    [key:string]: any;
  }
}

declare module '*.svg';
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.bmp';
declare module '*.tiff';

