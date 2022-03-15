const routes = [
  {
    name: "测试1",
    path: "/test1",
    component: () => import("./page/myPage.vue"),
    meta: { requireAuth: false }
  },
  {
    name: "测试2",
    path: "/test2",
    component: () => import("./page/test.vue"),
    meta: { requireAuth: false }
  },
  {
    name: '列表',
    path: '/tableTest',
    component: () => import("./page/tableTest.vue"),
    meta: { requireAuth: true }
  }
];
export default routes;
