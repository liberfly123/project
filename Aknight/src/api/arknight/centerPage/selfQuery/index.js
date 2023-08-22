import { Request } from "@/hooks/request";
import url from "@/api/url";
import { reactive, toRef } from "vue";
import store from "@/store";

//获取自助查询信息
export function getSelfInquiries() {
    let datalist = reactive({
        datas: []
    })
    Request.getData(url.centerPage.selfQuery.selfInquiries).then(res => {
        //存selfQuery
        datalist.datas = toRef({ ...res.data.selfInquiries })
        store.commit("personalCenter/changeSelfQuery", datalist.datas)
        store.commit("changeStore", "isSelfQuery");
    })
    return datalist
}       