import { Request } from "@/hooks/request";
import { reactive, toRef } from "vue";
import url from "@/api/url";

// 新增表单内容
export function addMenu(data){
    let dataList = reactive({
        datas:[]
    })
    Request.postData(url.database.user.addMenu,data)
    .then(res =>{
         dataList.datas = toRef({...res.data})
    })

    return dataList
}
// 修改表单内容
export function setMenu(data){
    let dataList = reactive({
        datas:[]
    })

    Request.putData(url.database.user.setMenu,data)
    .then(res =>{
         dataList.datas = toRef({...res.data})
         console.log(res.data)
    })

    return dataList
}

// 删除表单内容
export function delMenu(data){
    let dataList = reactive({
        datas:[]
    })

    Request.delData(url.database.user.delMenu,{
        params:{
            id:data
        }
    })
    .then(res =>{
         dataList.datas = toRef({...res.data})
         console.log(res.data)
    })

    return dataList
}