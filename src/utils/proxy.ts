import { ComponentInternalInstance, getCurrentInstance } from 'vue'
const getProxy = () => {
    const { proxy } = getCurrentInstance() as ComponentInternalInstance
    return proxy;
}
export default getProxy;