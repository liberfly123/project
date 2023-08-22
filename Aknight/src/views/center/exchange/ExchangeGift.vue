<template>
	<div class="exchangeGift">
		<div v-for="(item, index) in datas.items" :key="index">
			<section>
				<img :src="item.titleImg" alt="" />
				{{ item.title }}
			</section>
			<section>
				<input v-model="context" type="text" v-if="index == 0" placeholder="-ARKNIGHTS-" />
				<button v-if="index == 0" @click="exchangeGift" :class="context == '' ? 'disabled' : ''">
					兑换礼包
				</button>
				<span v-if="index == 1">*仅显示最近10条礼包兑换记录</span>
				<table v-if="index == 1">
					<tr>
						<th>兑换时间</th>
						<th>礼包</th>
						<th>使用兑换码</th>
					</tr>
					<tr v-for="(item, index) in gift.context" :key="index">
						<td>{{ item.time }}</td>
						<td>{{ item.items }}</td>
						<td>{{ item.context }}</td>
					</tr>
					<tr v-show="gift.context == 0">
						<td colspan="3" style="padding: 4vh 0;">
							暂无记录
						</td>
					</tr>
				</table>
			</section>
		</div>
	</div>
	<!-- 吐丝 -->
	<messagePage v-if="controlObj.isTusi"></messagePage>
</template>

<script>
import { ref, reactive, toRefs, onUpdated } from "vue";
import exchangeGiftScss from "@/public/personalCenter/exchange/exchangeGift.scss";
import { getRedemptionCode, getGift } from "@/api/arknight/centerPage/exchangeGift";
import controlObj from "@/hooks/controlObj";
export default {
	name: "ExchangeGift",
	setup() {
		let context = ref("");
		let gift = reactive({});
		onUpdated(() => {
			//获取历史记录
			let datalist = JSON.parse(localStorage.getItem("context"))
				? JSON.parse(localStorage.getItem("context")).contexts.filter(
					(item) => item.items)
				: [];
			Reflect.set(gift, "context", datalist);
		});
		// 兑换礼包函数
		function exchangeGift() {
			let zz = /^\w{13,}$/;
			if (zz.test(context.value)) {
				getGift(context.value);
			}
			context.value = "";
		}
		return {
			//样式
			exchangeGiftScss,
			//按钮集合
			controlObj,
			//输入框文字
			context,
			//历史兑换记录
			gift,
			//图标请求
			...toRefs(getRedemptionCode()),
			//点击兑换
			exchangeGift
		};
	}
};
</script>

<style lang="scss" scoped></style>
