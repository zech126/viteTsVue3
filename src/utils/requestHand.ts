// import common from '@/assets/scripts/common';
const process = import.meta.env;
export default {
  // 匹配不同模块服务地址
  baseHand: (url:any) => {
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
    200: (response:any, responseData:any, record:any) => {
      return responseData
    },
    // token 无效 或 过去
    451: (response:any, responseData:any, record:any) => {
      record.againLogin();
      return responseData;
    }
  },
  // 其他
  other: {
    unknown: '系统未知错误,请反馈给管理员'
  }
}