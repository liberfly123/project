import { Request } from "@/hooks/request";
import url from "@/api/url";
import { reactive, toRef } from "vue";

//个人中心页面图片请求
export function centerImg() {
    let datalist = reactive({ bgImg: [] })
    Request.getData(url.centerPage.centerImg).then(res => {
        datalist.bgImg = toRef({ ...res.data.personal })
    })
    return datalist
}