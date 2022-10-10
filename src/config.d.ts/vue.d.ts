/// <reference types="vite/client" />
import { AxiosInstance } from "axios";
import { Router, RouteLocationNormalizedLoaded } from "vue-router";
import { Store } from "vuex";
import dayjs from 'dayjs';
import type lodash from 'lodash';
import type { commonClass } from "../utils/common";
import type { Message, Notify, LoadingOptions, IElMessageBox } from 'element-plus';

type apiValType = string & {readonly[key:string]: apiValType};
type PluginFunc<T = unknown> = (option: T, c: typeof dayjs.Dayjs, d: typeof dayjs) => void;
interface RouteOptions extends RouteLocationNormalizedLoaded {
  herf: string;
}
//全局配置（typescript使用）
declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    readonly $http: Readonly<AxiosInstance>;
    readonly $common: Readonly<commonClass>;
    readonly localforage: LocalForage;
    readonly $dayjs: {
      readonly extend:<T = unknown>(plugin: PluginFunc<T>, option?: T) => dayjs.Dayjs;
      readonly locale:(preset?: string | ILocale, object?: Partial<ILocale>, isLocal?: boolean) => string;
      readonly isDayjs: (d: any) => d is dayjs.Dayjs;
      readonly unix: (t: number) => dayjs.Dayjs;
      (date?: dayjs.ConfigType, format?: dayjs.OptionType, locale?: string, strict?: boolean): dayjs.Dayjs;
    };
    readonly $message: Message;
    readonly $msgbox: IElMessageBox;
    readonly $messageBox: IElMessageBox;
    readonly $alert: IElMessageBox['alert'];
    readonly $confirm: IElMessageBox['confirm'];
    readonly $prompt: IElMessageBox['prompt'];
    readonly $notify: Notify;
    readonly $loading: (options:LoadingOptions) => void;
    readonly $route: RouteOptions;
    readonly $router: Router;
    readonly $store: Store<any>;
    readonly api: apiValType;
    readonly $api: apiValType;
    readonly $refs: Array<any> | {[key: string]: any};
    readonly lodash: typeof lodash;
    // [key:string]: any;
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

