/// <reference types="vite/client" />
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}
// 环境变量
interface ImportMetaEnv {
  VITE_CONFIG: string,
  VITE_SYSTEMCODE: string
  VITE_AUTH: string,
  VITE_BASEURL: string
}
