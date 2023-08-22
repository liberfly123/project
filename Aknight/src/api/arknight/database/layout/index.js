import url from "@/api/url";
import { dealpaths, handleRoutes } from "@/hooks/handleRoutes";
import { Request } from "@/hooks/request";
import store from "@/store";
import { reactive } from "vue";
import router from "@/router";

//获取数据库路由和基本信息(菜单)
export function getMenu() {
	let dataList = reactive({
		datas: []
	});
	Request.getData(url.database.layout.menu).then((res) => {
		dataList.datas = { ...res.data.menu };
		//处理路由并存路由
		let routes = dealpaths(res.data.menu, 0, "component");
		//存数据
		store.commit("dataBase/changeMenu", { routes, menuList: dataList.datas });
		//打开存储开关
		store.commit("changeStore", "isMenus");
		//处理路由并添加进路由组
		setTimeout(() => {
			let routes2 = handleRoutes(routes, routes.length - 1);
			routes2.forEach((item) => {
				router.addRoute("databasePage", item);
			});
			// 要等仓库中开关关闭之后再处理添加路由
		}, 300)
	});
	return dataList;
}
