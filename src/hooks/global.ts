import { ComponentInternalInstance, getCurrentInstance } from 'vue'
const getGlobal = () => {
    const { appContext } = getCurrentInstance() as ComponentInternalInstance
    return appContext.config.globalProperties;
}
export default getGlobal;