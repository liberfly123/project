<template>
	<div style="height: 8.5rem"></div>
	<div class="ThirdShare" v-for="(item, index) in datas" :key="index">
		<section class="title">{{ item.title }}</section>
		<div class="content">
			<section>
				<span>功能类型</span><span>{{ item.type }}</span>
			</section>
			<section>
				<span>第三方主体</span><span>{{ item.master }}</span>
			</section>
			<section>
				<span>使用目的</span><span>{{ item.target }}</span>
			</section>
			<section>
				<span>共享方式</span><span>{{ item.method }}</span>
			</section>
			<section>
				<span>涉及个人信息类型</span><span>{{ item.messageType }}</span>
			</section>
			<section>
				<span>第三方隐私协议政策或官网链接</span><a :href="item.URL">{{ item.URL }}</a>
			</section>
		</div>
	</div>
</template>

<script>
import { getShare } from "@/api/arknight/centerPage/thirdShare";
import { toRefs } from "vue";
export default {
	name: "ThirdShare",
	setup() {
		return {
			//渲染数据
			...toRefs(getShare())
		};
	}
};
</script>

<style lang="scss" scoped>
</style>
