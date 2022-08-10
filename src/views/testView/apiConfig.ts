const api = {
  module1: {
    api1: '/sdgfd/sdgh',
    api2: '/sdfh'
  },
  module2: '/api/module2',
  module3: {
    api1: '/api1',
    api2: '/api2',
    api3: {
      ff: '/ff'
    },
    api4: '/api4'
  },
  testApi: {
    selectUserInfo: '/sys/user/userInfoList'
  },
  uploadFile: {
    upload: '/common/upload'
  }
};
const apiHand = (obj:any, str:any) => {
  for (let key in obj) {
    if (typeof obj[key] === 'string') {
      obj[key] = `${str}${obj[key]}`;
    } else {
      apiHand(obj[key], str);
    }
  }
}

apiHand(api.testApi, '/dyt-cloud-upms-admin');
apiHand(api.uploadFile, '/dyt-cloud-oss-admin');

export default api;
