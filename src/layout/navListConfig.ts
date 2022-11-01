const navList = [
  {
    id: '1',
    name: '测试模块',
    icon: '',
    childList: [
      {
        id: '1-1',
        name: '表格测试',
        icon: '',
        url: '/tableTest',
      },
      {
        id: '1-2',
        name: '测试页面',
        icon: '',
        url: '/test1'
      },
      {
        id: '1-21',
        name: 'common-测试1',
        icon: '',
        url: '/test-2'
      },
      {
        id: '1-22',
        name: 'common-测试2',
        icon: '',
        url: '/test-3'
      },
      {
        id: '1-3',
        name: 'jsx测试',
        icon: '',
        url: '/test2'
      },
      {
        id: '1-4',
        name: '百度编辑器',
        icon: '',
        url: '/testUEditor'
      },
      {
        id: '1-5',
        name: '404测试',
        childList: [
          {
            id: '5-1',
            name: '404页面',
            icon: '',
            url: '/test/test'
          }
        ]
      },
    ]
  }
]
export default navList;
