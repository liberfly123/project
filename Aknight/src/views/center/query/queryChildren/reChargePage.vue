<template>
	<!-- <div class="childrenItem"> -->
	<div class="SelfQuery" style="width: 35rem">
		<section style="font-size: 1rem;font-weight:bold;">{{ title }}</section>
		<div class="QueryItem">
			<section>
				<span style="color: #158fc5; margin-right: 0.5rem">UID</span><span>{{ UID }}</span>
			</section>
			<table style="width: 100%">
				<tr>
					<th>游戏订单号</th>
					<th>平台</th>
					<th>金额￥</th>
					<th>商品名称</th>
					<th>交易时间</th>
				</tr>
				<tr v-for="(item, index) in children" :key="index">
					<td>{{ item.Inumber }}</td>
					<td>{{ item.place }}</td>
					<td>{{ item.amount }}</td>
					<td>{{ item.shopping }}</td>
					<td>{{ item.time }}</td>
				</tr>
			</table>
			<section style="font-size: 14px;color:#ccc;">
				<p>*1.可查询30日、100条以内有效数据。</p>
				<p>**2.查询结果可能与游戏内实际操作存在延迟。</p>
			</section>
		</div>
	</div>
	<!-- </div> -->
</template>

<script>
import { useRoute } from "vue-router";
import { toRefs, reactive } from "vue";
export default {
	name: "reChargePage",
	setup() {
		let route = useRoute();
		let UID = JSON.parse(localStorage.getItem("userMsg")).UID;
		let data = JSON.parse(sessionStorage.getItem("selfQuery")).selfQuery

		return {
			//本地存储的UID
			UID,
			route,
			//请求数据
			...toRefs(reactive(data.items[route.query.index]
			))
		};
	}
};
</script>

<style lang="scss" scoped></style>
