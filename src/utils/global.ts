import type { commonClass } from "./common";
import { AxiosInstance } from "axios";
import { ComponentInternalInstance, getCurrentInstance } from 'vue'
const getGlobal = () => {
    const { appContext } = getCurrentInstance() as ComponentInternalInstance
    return appContext.config.globalProperties as  {
        $http: AxiosInstance;
        localforage: LocalForage;
        $common: commonClass;
        api: {[key:string]: any};
        $api: {[key:string]: any};
        $dayjs: any;
        [key:string]:any;
    }
}
export default getGlobal;