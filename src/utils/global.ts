import type { commonClass } from "./common";
import { AxiosInstance } from "axios";
import { ComponentInternalInstance, getCurrentInstance } from 'vue';
import dayjs from 'dayjs';
import { Router, RouteLocationNormalizedLoaded } from "vue-router";
import { Store } from "vuex";
import type { Message, Notify, LoadingOptions, IElMessageBox } from 'element-plus';

type apiValType = {readonly[key:string]: apiValType};
type PluginFunc<T = unknown> = (option: T, c: typeof dayjs.Dayjs, d: typeof dayjs) => void;
interface RouteOptions extends RouteLocationNormalizedLoaded {
  herf: string;
}

const getGlobal = () => {
  const { appContext } = getCurrentInstance() as ComponentInternalInstance;
  return appContext.config.globalProperties as  {
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
    // [key:string]:any;
  }
}
export default getGlobal;