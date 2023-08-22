import { Request } from "@/hooks/request";
import url from "@/api/url";
import { reactive, toRef } from "vue";
import store from "@/store";

//获取个人信息页面信息
export function getBaseMsg(data) {
    let datalist = reactive({
        datas: []
    })
    Request.postData(url.centerPage.baseMsg.getBaseMsg, data).then(res => {
        datalist.datas = toRef({ ...res.data.users })
        //存baseMsg
        store.commit("personalCenter/changeBaseMsg", datalist.datas)
        store.commit("changeStore", "isBaseMsg")
    })
    return datalist
}

//个信息页面修改请求
export function setMsg(url, data) {
    let dataList = reactive({
        datas: [],
    });
    Request.putData(url, data).then((res) => {
        dataList.datas = { ...res.data };
    });
    return dataList;
}
