import type { RouteRecordRaw } from "vue-router";

// 操作室大屏路由配置
const routes: RouteRecordRaw[] = [
  {
    path: "/card", // 父路由路径
    name: "OperationRoom",
    meta: {
      title: "操作室管理", // 侧边栏菜单标题
      icon: "ant-design:dashboard-outlined", // 大屏图标（可自定义）
      orderNo: 600, // 菜单排序（数字越小越靠前）
    },
    children: [
      // 操作牌大屏页面
      {
        path: "operation-tag", // 子路由路径
        name: "OperationTagScreen",
        component: () => import("@/views/room/operationRoom/Monitor.vue"), // 大屏组件路径
        meta: {
          title: "操作牌大屏", // 页面/菜单标题
          icon: "ant-design:monitor-outlined", // 子菜单图标
          keepAlive: true, // 大屏页面建议缓存，提升性能
          hideInMenu: false, // 是否显示在侧边栏（true=隐藏，false=显示）
        },
      },
      // 可选：操作牌管理页面（如新增/编辑/归还操作牌）
      // {
      //   path: "tag-manage",
      //   name: "OperationTagManage",
      //   component: () => import("@/views/operation-room/tag-manage/index.vue"),
      //   meta: {
      //     title: "操作牌管理",
      //     icon: "ant-design:table-outlined",
      //     keepAlive: true,
      //   },
      // },
      // 可选：操作牌详情页（通过ID查看/编辑单条数据）
      // {
      //   path: "tag-detail",
      //   name: "OperationTagDetail",
      //   component: () => import("@/views/operation-room/tag-detail/index.vue"),
      //   meta: {
      //     title: "操作牌详情",
      //     activePath: "/operation-room/tag-manage", // 侧边栏高亮父菜单
      //     hideInMenu: true, // 详情页不显示在侧边栏
      //     keepAlive: false,
      //   },
      //   props: (route) => ({
      //     id: route.query.id, // 接收URL参数id，传递给组件
      //   }),
      // },
    ],
  },
];

export default routes;
