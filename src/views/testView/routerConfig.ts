const routes = [
  {
    name: "页面测试",
    path: "/test1",
    component: () => import("./page/myPage.vue"),
    meta: { requireAuth: false, keepAlive: false }
  },
  {
    name: "JSX 测试",
    path: "/test2",
    component: () => import("./page/test.vue"),
    meta: { requireAuth: false,keepAlive: false }
  },
  {
    name: '表格测试',
    path: '/tableTest',
    component: () => import("../testView/page/tableTest.vue"),
    meta: { requireAuth: true, keepAlive: true }
  },
  {
    name: '百度编辑器',
    path: '/testUEditor',
    component: () => import("./page/testUEditor.vue"),
    meta: { requireAuth: false, keepAlive: false }
  }
];
export default routes;
