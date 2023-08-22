import { Request } from "@/hooks/request";
import { reactive } from "vue";
import url from "@/api/url";
import store from "@/store/index";

//获取数据库首页信息
//key:外部导入,区分不同请求
export function getMedical(key) {
    let dataList = reactive({
        datas: [],
    });
    Request.getData(url.database.home[key]).then((res) => {
        dataList.datas = { ...res.data.datas };
        switch (key) {
            case "expMedicals":
                store.commit("dataBase/changeExpMedicals", res.data.datas)
                break;
            case "basicMedical":
                store.commit("dataBase/changeBasicMedical", res.data.datas)
                break;
            case "naweiCompany":
                store.commit("dataBase/changeNaweiCompany", res.data.datas)
                break;
            case "naweiCompany2":
                store.commit("dataBase/changeNaweiCompany2", res.data.datas)
                break;
            case "expMedical":
                store.commit("dataBase/changeExpMedical", res.data.datas)
                break;
        }
        store.commit("changeStore", "isMedical")
    });
    return dataList;
}
//获取页面信息(homePage头部四个盒子)
export function getMessages() {
    let dataList = reactive({
        menus: [],
    });
    Request.getData(url.database.home.messages).then((res) => {
        dataList.menus = { ...res.data.menu };
    });
    return dataList;
}
//获取快捷工具渲染数据
export function getNavTools() {
    let dataList = reactive({
        tools: [],
    });
    Request.getData(url.database.home.navTools).then((res) => {
        dataList.tools = { ...res.data.navTools };
    });
    return dataList;
}