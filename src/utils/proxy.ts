import { ComponentInternalInstance, getCurrentInstance, ComponentPublicInstance, ComponentOptionsBase } from 'vue'
const getProxy = () => {
    const { proxy } = getCurrentInstance() as ComponentInternalInstance;
    // return proxy;
    return proxy as ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}>>;
}
export default getProxy;