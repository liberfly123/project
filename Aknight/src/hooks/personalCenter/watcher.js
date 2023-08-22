// 导入监听函数
import { watch } from "vue";
import controlObj from "../controlObj";

// 封装监听函数
//arr为要监听是数组，   index 为密码的下标
export function observer(arr, index = 1) {
	arr.forEach((item) => {
		watch(
			// 直接监听输入框的值，要写成函数的形式
			() => item.value,
			(newValue) => {
				if (newValue == "") {
					//输入框值为空，显示错误
					item.isShow = true;
				} else if (item.zz) {
					//判断是否有正则
					if (item.zz.test(newValue)) {
						//符合正则，隐藏错误提示
						item.isShow = false;
						// 判断是否为手机号，手机号符合正则，获取验证码按钮才可用
						if (item.type == "tel") {
							controlObj.isDisabled = true;
						}
					} else {
						//不符合正则，显示错误提示
						item.isShow = true;
						// 判断是否为手机号，手机号不符合正则，获取验证码按钮不可用
						if (item.type == "tel") {
							controlObj.isDisabled = false;
						}
					}
				} else {
					// 没有正则就是确认密码的输入框
					// 判断密码与确认密码是否相等，不想等就显示错误，相等就隐藏错误
					// 输入确认密码时生效
					if (newValue == arr[index].value) {
						item.isShow = false;
					} else {
						item.isShow = true;
					}
				}
			}
		);
	});
}
