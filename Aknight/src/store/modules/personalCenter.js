import moment from "moment/moment"
//个人中心仓库
export default ({
    namespaced: true,
    state() {
        return {
            token: null,
            userId: null,
            UID: null,
            ID: null,
            email: null,
            fullName: null,
            menus: null,
            menuRoutes: null,
            baseMsg: null,
            contexts: null,
            selfQuery: null,
        }
    },
    mutations: {
        //登录存token
        changeToken(state, data) {
            state.token = data.token
        },
        //注册存userId和UID
        changeUserMsg(state, data) {
            state.userId = data.userId
            state.UID = data.UID
        },
        //buffer页面存渲染数据
        changeMenus(state, data) {
            state.menus = data
        },
        //buffer页面存路由
        changeMenuRoutes(state, data) {
            state.menuRoutes = data
        },
        //baseMsg页面存请求数据
        changeBaseMsg(state, data) {
            state.baseMsg = data
        },
        //exChangeGift页面获取和兑换
        changeContexts(state, data) {
            // 第一次设置空数组
            if (state.contexts == null) {
                JSON.parse(localStorage.getItem("context")) != 0 && JSON.parse(localStorage.getItem("context")) != null ?
                    state.contexts = JSON.parse(localStorage.getItem("context")).contexts :
                    state.contexts = []
            }
            // 判断是对象还是数组，通过length属性判断，数组有，对象没有
            if (Reflect.has(data, "length")) {
                // 数组,判断长度是否大于0，大于0添加，不大于0不操作
                data.length > 0 ? data.forEach(item => {
                    // 设置空对象，存放context(兑换码)
                    let obj = {};
                    Reflect.set(obj, "context", item)
                    state.contexts.push(obj)
                }) : ""
            } else {
                // 对象
                // 获取当前时间
                let time = moment().format("YYYY-MM-DD/ hh:mm:ss a")
                // 遍历contexts数组
                state.contexts.forEach(item => {
                    // 判断请求到的兑换码与正在兑换的兑换码是否相等
                    if (item.context == data.context) {
                        item.time = time
                        item.items = data.items
                    }
                })
            }
        },
        //selfQuery页面获取
        changeSelfQuery(state, data) {
            state.selfQuery = data
        }
    }
})