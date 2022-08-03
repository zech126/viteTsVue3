import type { commonClass } from "./common";
import { AxiosInstance } from "axios";
import { ComponentInternalInstance, getCurrentInstance } from 'vue';
import dayjs from 'dayjs';
import { Router, RouteLocationNormalizedLoaded } from "vue-router";
import { Store } from "vuex";
import type { Message, Notify, LoadingOptions, IElMessageBox } from 'element-plus';

type PluginFunc<T = unknown> = (option: T, c: typeof dayjs.Dayjs, d: typeof dayjs) => void;
interface RouteOptions extends RouteLocationNormalizedLoaded {
  herf: string;
}

const getGlobal = () => {
  const { appContext } = getCurrentInstance() as ComponentInternalInstance;
  return appContext.config.globalProperties as  {
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
    $msgbox: IElMessageBox;
    $messageBox: IElMessageBox;
    $alert: IElMessageBox['alert'];
    $confirm: IElMessageBox['confirm'];
    $prompt: IElMessageBox['prompt'];
    $notify: Notify;
    $loading: (options:LoadingOptions) => void;
    $route: RouteOptions;
    $router: Router;
    $store: Store<any>;
    api: Readonly<{[key:string]: any}>;
    $api: Readonly<{[key:string]: any}>;
    // [key:string]:any;
  }
}
export default getGlobal;