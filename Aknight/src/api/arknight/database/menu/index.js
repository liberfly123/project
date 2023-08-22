import { Request } from "@/hooks/request"
import { reactive, toRef } from "vue"
import store from "@/store"
import { toest } from "@/hooks/toset";
import controlObj from "@/hooks/controlObj";
// 新增表单内容
export function addMenu(url, data) {
    let dataList = reactive({
        datas: [],
        loading: false
    })

    dataList.loading = true

    Request.postData(url, data)
        .then(res => {
            dataList.datas = toRef({ ...res.data })
            store.commit("changeMsg", res.data)
            toest(controlObj)
        })
        .catch(error => {
            console.error("添加时发生错误：", error)
        })
        .finally(() => {
            dataList.loading = false
        })
}

// 修改表单内容
export function setMenu(url, data) {
    let dataList = reactive({
        datas: [],
        loading: false
    })

    dataList.loading = true

    Request.putData(url, data)
        .then(res => {
            dataList.datas = toRef({ ...res.data })
            store.commit("changeMsg", res.data)
            toest(controlObj)
        })
        .catch(error => {
            console.error("修改时发生错误：", error)
        })
        .finally(() => {
            dataList.loading = false
        })
    return dataList
}

// 删除表单内容
export function delMenu(url, data) {
    let dataList = reactive({
        datas: [],
        loading: false
    })

    dataList.loading = true

    Request.delData(url, {
        params: {
            id: data
        }
    })
        .then(res => {
            dataList.datas = toRef({ ...res.data })
        })
        .catch(error => {
            console.error("删除时发生错误：", error)
        })
        .finally(() => {
            dataList.loading = false
        })
    return dataList
}