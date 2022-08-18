// 环境变量
declare interface ImportMetaEnv {
  readonly VITE_CONFIG: string;
  readonly VITE_SYSTEMCODE: string;
  readonly VITE_AUTH: string;
  readonly VITE_BASEURL: string;
  readonly [key:string]: string;
}
declare interface HTMLElement {
  currentStyle: {
    [key:string]: string;
  }
}
