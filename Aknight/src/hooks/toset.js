// 封装吐丝
export function toest(controlObj) {
	//延时显示吐丝
	controlObj.isTusi = true;
	//2秒后吐丝消失
	setTimeout(() => {
		controlObj.isTusi = false;
	}, 2000);
}
