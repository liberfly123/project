import controlObj from "../controlObj"
import { observer } from "./watcher"
//切换登录方式
export const loginMethod = (arr, addArr) => {
    controlObj.isCode = !controlObj.isCode
    //判断是登录框
    if (!controlObj.isChange) {
        //判断切换的登录方式:false为密码登录,true为短信登录
        controlObj.isCode ?
            arr.splice(1, 1, addArr[2]) : arr.splice(1, 1, addArr[0])
    }
    observer(arr)
}