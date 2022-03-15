import { AxiosInstance } from "axios";
// import { Router } from 'vue-router'
import commonObject from './commonObject'

//全局配置（typescript使用）
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $http: AxiosInstance;
    $dayjs: Function;
    $common: commonObject;
  }
}

declare module '*.svg';
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.bmp';
declare module '*.tiff';

