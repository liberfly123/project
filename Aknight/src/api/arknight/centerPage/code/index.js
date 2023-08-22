import url from "@/api/url";
import { Request } from "@/hooks/request";
import { reactive, toRef } from "vue";
import store from "@/store";
import router from "@/router";
import { toest } from "@/hooks/toset";
import controlObj from "@/hooks/controlObj";
//获取图形验证码
export function mathCode() {
    let dataList = reactive({
        codes: [],
    });

    Request.getData(url.centerPage.mathCode).then((res) => {
        dataList.codes = toRef(res.data);
    });

    return dataList;
}

//发送短信以及注册登录通用
//url:对应请求路径 data:请求所需要传的数据 changeFn:vuex中对应的mutation方法名字,此处是vuex存吐丝的方法名
//fn:用于区分是调用的根仓库还是子仓库的方法
//如果是子仓库方法就需要用bind改变仓库的this指向,根仓库则不需要 =>根仓库本身指向于设置的store,子仓库指向于vuex全局的store
//isStore:对应存储开关
export function user(url, data, fn, isStore) {
    let dataList = reactive({
        datas: [],
    });
    Request.postData(url, data).then((res) => {
        dataList.datas = toRef({ ...res.data });
        store.commit("changeMsg", res.data)
        toest(controlObj)
        if (fn) {//代表存在调用的是子仓库函数
            //开启存储开关(登录注册需要)
            store.commit("changeStore", isStore)
            //改变指向
            fn.bind({ $store: store })(res.data)
            //调用吐丝
            if (isStore == "isLogin") {
                //存手机号(带*)
                store.commit("changeTel", dataList.datas.telephone);
                //存手机号(不带*)
                store.commit("changeRealTel", data.telephone)
                // 有token，登录成功，页面跳转
                if (store.state.personalCenter.token) {
                    router.push({
                        name: "bufferPage"
                    })
                }
            }
        }
    });

    return dataList;
}