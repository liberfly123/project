<template>
	<div class="toDatabase">
		<div>
			<section>
				<h1>前往数据库</h1>
			</section>
			<section><button @click="toDatabase">点击前往数据库</button></section>
		</div>
	</div>
</template>

<script>
import { useRouter } from "vue-router";
import { getMenu } from "@/api/arknight/database/layout";
export default {
	name: "ToDatabase",
	setup() {
		let router = useRouter();
		getMenu();
		//跳转到数据库布局页面
		function toDatabase() {
			router.push({
				name: "databasePage"
			});
		}
		// // 组件内守卫-离开当前路由时触发
		// onBeforeRouteLeave(() => {
		// 	// 刷新页面，解决进入数据库后，菜单栏没有内容问题
		// 	// 但是要卡在路由添加之后再刷新
		// 	setTimeout(() => {
		// 		router.go(0);
		// 	}, 1500);
		// });
		return {
			toDatabase
		};
	}
};
</script>

<style lang="scss" scoped></style>
