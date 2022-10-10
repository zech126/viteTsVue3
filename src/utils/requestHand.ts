import common from '@/utils/common';
const process = import.meta.env;
export default {
  // 匹配不同模块服务地址
  baseHand: (url:string) => {
    // if (url.includes('/dyt-cloud-upms-admin/')) {
    //   return process.VITE_BASEURL ?  `${window.location.protocol}//${process.VITE_BASEURL}` : '/';
    // }
    return process.VITE_BASEURL ? `${window.location.protocol}//${process.VITE_BASEURL}` : '/';
  },
  // 返回提示文本, 此次可使用方法
  tipsTxt: {
    401: '前方限行，需联系管理员授权方可通行！',
    404: '请检查网络是否可用或联系管理员！',
    500: '前方有故障，请稍后再试！',
    504: '前方拥堵，请稍后再试！'
  },
  // 处理方法, 执行后不会继续执行后面代码
  hand: {
    200: (response:{[i:string]:any}, responseData:any) => {
      return responseData
    },
    // token 无效 或 过去
    451: (response:{[i:string]:any}, responseData:any) => {
      console.error('登录过期')
      return responseData;
    }
  },
  // 其他
  other: {
    unknown: '系统未知错误,请反馈给管理员'
  },
  // 下载文件
  downLoadFile: (response:{[i:string]:any}) => {
    let str = response.headers['content-disposition'];
    if (!response || !str) return response.data;
    // let suffix = '';
    let fileName = '';
    // 截取文件名和文件类型
    if (str.lastIndexOf('.')) {
      fileName = decodeURI(str.substring(str.indexOf('=') + 1, str.lastIndexOf('.')));
    }
    common.downloadFile(response.data, {name: fileName});
    return response.data;
  }
}