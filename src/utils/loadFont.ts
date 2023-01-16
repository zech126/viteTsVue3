// 将所有的字体图标导入
const iconfont = import.meta.glob("../assets/iconFont/*/iconfont.css");
import common from '@/utils/common';
const files = {...iconfont};

const handFiles = ():Promise<Array<{fileKey: string, value: {[key:string]: any}}>> => {
  return new Promise((resolve) => {
    const fileKeys = Object.keys(files);
    const allFileRes = fileKeys.map(key => {
      return () => {
        files[key]()
      }
    });
    common.allSettled(allFileRes).then(arr => {
      const filesRes = arr.map((m:any, i) => {
        return { status: m.status, value: m.value.default, fileKey: fileKeys[i]}
      }).filter(f => f.status === 'fulfilled')
      resolve(filesRes);
    })
  })
}

handFiles().then(res => {});

export default {};
