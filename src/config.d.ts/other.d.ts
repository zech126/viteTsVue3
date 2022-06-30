declare type myObject  = {
  [key: string]: any;
}

// 环境变量
declare interface ImportMetaEnv {
  VITE_CONFIG: string;
  VITE_SYSTEMCODE: string;
  VITE_AUTH: string;
  VITE_BASEURL: string;
  [key:string]: string;
}

