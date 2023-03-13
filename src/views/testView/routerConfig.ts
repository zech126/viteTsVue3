const routes = [
  {
    name: "页面测试",
    path: "/test1",
    component: () => import("./page/myPage.vue"),
    meta: { requireAuth: false, keepAlive: false }
  },
  {
    name: "页面测试1",
    path: "/test-2",
    component: () => import("./page/myPage1.vue"),
    meta: { requireAuth: false, keepAlive: false }
  },
  {
    name: "页面测试2",
    path: "/test-3",
    component: () => import("./page/myPage2.vue"),
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
  },
  {
    name: 'html2canvas',
    path: '/imageClear',
    component: () => import("./page/imageClear.vue"),
    meta: { requireAuth: false, keepAlive: false }
  },
];
export default routes;
