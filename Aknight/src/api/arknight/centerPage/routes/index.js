import url from "@/api/url";
import { handleRoutes } from "@/hooks/handleRoutes";
import { Request } from "@/hooks/request";
import router from "@/router";
import store from "@/store";
import { reactive, toRef } from "vue";
// 登录成功请求路由
export function centerMenu() {
    let dataList = reactive({ menu: [] })

    Request.getData(url.centerPage.centerRoutes).then(res => {
        dataList.menu = toRef({ ...res.data })
        if (res.data.status) {
            let { loginOut, navSvg, nav } = dataList.menu.datas
            let routes = []
            let menuMsg = nav.map(item => {
                let { route, ...msg } = item
                routes.push(route)
                return msg
            })
            menuMsg = { menuMsg, loginOut, navSvg }

            // 处理路由之前先存本地
            store.commit("personalCenter/changeMenuRoutes", routes)
            store.commit("personalCenter/changeMenus", menuMsg)
            store.commit("changeStore", "isMenu")
            //处理路由
            routes = handleRoutes(routes, routes.length - 1)
            // 添加动态路由
            routes.forEach(item => {
                router.addRoute("centerPage", item)
            })
            //2秒后跳转到BaseMessage页面
            setTimeout(() => {
                router.push({
                    name: "BaseMessage",
                    params: {
                        userId: JSON.parse(localStorage.getItem("userMsg")).userId
                    }
                })
            }, 2000)

        }
    })
}
