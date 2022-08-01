/// <reference types="vite/client" />
import { AxiosInstance } from "axios";
import { Router, RouteLocationNormalizedLoaded } from "vue-router";
import { Store } from "vuex";
import dayjs from 'dayjs';
import type { commonClass } from "../utils/common";
import type { Message, Notify, LoadingOptions } from 'element-plus';

type PluginFunc<T = unknown> = (option: T, c: typeof dayjs.Dayjs, d: typeof dayjs) => void;
interface RouteOptions extends RouteLocationNormalizedLoaded {
  herf: string;
}
//全局配置（typescript使用）
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $http: Readonly<AxiosInstance>;
    $common: Readonly<commonClass>;
    localforage: LocalForage;
    $dayjs: {
      extend:<T = unknown>(plugin: PluginFunc<T>, option?: T) => dayjs.Dayjs;
      locale:(preset?: string | ILocale, object?: Partial<ILocale>, isLocal?: boolean) => string;
      isDayjs: (d: any) => d is dayjs.Dayjs;
      unix: (t: number) => dayjs.Dayjs;
      (date?: dayjs.ConfigType, format?: dayjs.OptionType, locale?: string, strict?: boolean): dayjs.Dayjs;
    };
    $message: Message;
    $messageBox: (options: {[key:string]:any}) => void;
    $msgbox: (options: {[key:string]:any}) => void;
    $alert: (message: string, title?:string | {[key:string]:any}, options?: {[key:string]:any}) => void;
    $confirm: (message: string, title?:string | {[key:string]:any}, options?: {[key:string]:any})=> void;
    $prompt: (message: string, title?:string | {[key:string]:any}, options?: {[key:string]:any}) => void;
    $notify: Notify;
    $loading: (options:LoadingOptions) => void;
    $route: RouteOptions;
    $router: Router;
    $store: Store<any>;
    api: Readonly<{[key:string]: any}>;
    $api: Readonly<{[key:string]: any}>;
    $refs: Array<any> | {[key: string]: any};
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

