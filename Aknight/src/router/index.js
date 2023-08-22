import { handleRoutes } from "@/hooks/handleRoutes";
import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    path: "/center",
    name: "centerPage",
    component: () => import("@/views/center/centerPage"),
    children: [
      {
        path: "/center/login",
        name: "loginPage",
        component: () => import("@/views/center/login/loginPage"),
        children: [
          {
            path: "/center/login/buffer",
            name: "bufferPage",
            component: () => import("@/views/center/buffer/bufferPage")
          }
        ]
      },
    ]
  },
  {
    path: "/database",
    name: "databasePage",
    component: () => import("@/views/database/databasePage"),
  },

];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

//设置白名单
const whiteRoute = ["/center", "/center/login"]

//路由前置守卫设置路由鉴权
router.beforeEach((to, from, next) => {
  //当前路径是否在白名单内,在就放行
  if (whiteRoute.includes(to.path)) {
    next()
  }
  else {
    //当前路径不在白名单内,判断是否有权限
    if (JSON.parse(localStorage.getItem("token"))) {
      let token = JSON.parse(localStorage.getItem("token")).token
      if (token) {
        if (to.matched[0]) {
          next()
        } else {
          //防止页面空白
          let PATH = to.path.split("/")[1];
          let routeData = JSON.parse(sessionStorage.getItem(PATH == "center" ? "menu" : "menus"))
          let route = Reflect.get(routeData, "menuRoutes")

          route = handleRoutes(route, route.length - 1)
          route.forEach(item => {
            router.addRoute(PATH == "center" ? "centerPage" : "databasePage", item)
          })

          // 自定义添加子路由
          router.addRoute("centerPage", {
            path: "/center/change/:userId",
            name: "changeInfo",
            component: () => import("@/views/center/basemsg/change/changeInfo")
          })

          let route2 = ["reChargePage", "exclusivePage", "sourcePage"]
          route2.forEach(item => {
            router.addRoute("centerPage", {
              path: `/center/${item}`,
              name: item,
              component: () => import(`@/views/center/query/queryChildren/${item}`)
            })
          })

          let route3 = ["infoBasic", "infoRePage", "infoDevice"]
          route3.forEach(item => {
            router.addRoute("centerPage", {
              path: `/center/${item}`,
              name: item,
              component: () => import(`@/views/center/list/info/${item}`)
            })
          })

          next({
            ...to,
            replace: true
          })
        }
      }
    } else {
      //无权限者(需要登录获取权限)
      next({ path: "/center/login" })
    }
  }

})

export default router;
