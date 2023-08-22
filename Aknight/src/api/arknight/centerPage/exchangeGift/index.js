import url from "@/api/url";
import { Request } from "@/hooks/request";
import store from "@/store";
import { reactive, toRef } from "vue";
import { toest } from "@/hooks/toset";
import controlObj from "@/hooks/controlObj";
//获取兑换码
export function getRedemptionCode() {
	let dataList = reactive({
		datas: []
	});
	Request.getData(url.centerPage.exchangeGift.datas).then((res) => {
		dataList.datas = toRef({ ...res.data.exchangeGift });

		// 将兑换码存入仓库以及本地
		store.commit("personalCenter/changeContexts", res.data.context);
	});
	return dataList;
}

//兑换
export function getGift(data) {
	let dataList = reactive({
		datas: []
	});
	Request.postData(url.centerPage.exchangeGift.getGift, { context: data }).then((res) => {
		dataList.datas = { ...res.data };

		// 添加吐丝内容
		res.data.status == 0
			? store.commit("changeMsg", { message: "兑换成功", status: res.data.status })
			: store.commit("changeMsg", res.data);

		// 调用吐丝
		toest(controlObj);

		// 将兑换内容存入本地
		store.commit("personalCenter/changeContexts", {
			items: res.data.items,
			context: data
		});
		store.commit("changeStore", "isContext");
	});
	return dataList;
}
