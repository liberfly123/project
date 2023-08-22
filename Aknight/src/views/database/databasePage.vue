<template>
	<div class="common-layout">
		<el-container style="height: 100vh; width: 100vw">
			<!-- 侧边栏 -->
			<el-aside :width="!isCollapse ? '14vw' : '4vw'">
				<!-- 菜单 -->
				<el-menu background-color="#545c64" text-color="#fff" active-text-color="#409Eff" class="el-menu-demo"
					default-active="1" :collapse="isCollapse" :collapse-transition="false" style="height: 100vh">
					<!-- 首页 ， 一级菜单-->
					<el-menu-item index="1" v-for="(item, index) in menu" :key="index" v-show="!item.meta.isIframe"
						@click="toPage(index)">
						{{ item.meta.title }}
					</el-menu-item>
					<!-- 可下拉的菜单 -->
					<el-sub-menu v-for="(item, index) in menu" :key="index" :index="index.toString()"
						v-show="item.meta.isIframe">
						<template #title>
							<el-icon>
								<Setting />
							</el-icon>
							<span> {{ item.meta.title }}</span>
						</template>
						<!-- 子菜单 -->
						<el-menu-item v-for="(item2, index2) in item.children" :key="index + '-' + index2"
							:index="index.toString() + '-' + index2.toString()" v-show="!item2.meta.isIframe"
							@click="toPage(index, index2)">
							{{ item2.meta.title }}
						</el-menu-item>
					</el-sub-menu>
				</el-menu>
			</el-aside>
			<!-- 主要内容 -->
			<el-container>
				<!-- 头部 -->
				<el-header style="height: 11.5vh ; grid-template-columns:repeat:1fr;padding:0;">
					<el-menu text-color="#aaa" mode="horizontal" :ellipsis="false" style="height: 6.5vh">
						<el-menu-item index="0">
							<el-icon @click="isCollapse = !isCollapse">
								<Expand v-show="isCollapse" />
								<Fold v-show="!isCollapse" />
							</el-icon>
						</el-menu-item>
						<el-menu-item index="1">
							<!-- 面包屑 -->
							<!-- separator，每个面包屑用 / 分隔 -->
							<el-breadcrumb separator="/">
								<el-breadcrumb-item :to="{ name: 'homePage', params: { userId } }">
									首页
								</el-breadcrumb-item>
								<!-- 二级面包屑 -->
								<el-breadcrumb-item v-if="isbreadcrumb ? route.meta.isHide : ''">
									{{ metaName }}
								</el-breadcrumb-item>
								<!-- 三级面包屑 -->
								<el-breadcrumb-item :style="{
									animation: isPlay ? 'flyIn 0.25s 0s 1 linear forwards' : ''
								}" v-if="isbreadcrumb ? route.meta.isHide : ''">
									{{ route.meta.title }}
								</el-breadcrumb-item>
							</el-breadcrumb>
						</el-menu-item>
						<div class="flex-grow" />
						<el-menu-item index="2" style="padding: 0">
							<el-icon>
								<ChatSquare />
							</el-icon>
						</el-menu-item>
						<el-menu-item index="3" style="padding: 0">
							<el-icon>
								<EditPen />
							</el-icon>
						</el-menu-item>
						<el-menu-item index="4" style="padding: 0">
							<el-icon>
								<Search />
							</el-icon>
						</el-menu-item>
						<el-menu-item index="5" style="padding: 0">
							<el-icon>
								<Avatar />
							</el-icon>
						</el-menu-item>
						<el-menu-item index="6" style="padding: 0">
							<el-icon>
								<Bell />
							</el-icon>
						</el-menu-item>
						<el-menu-item index="7" style="padding: 0">
							<el-icon>
								<FullScreen />
							</el-icon>
						</el-menu-item>
						<el-sub-menu index="8" style="height: 6.3vh; padding: 0">
							<template #title>
								<div class="img"></div>
								用户名
							</template>
							<el-menu-item index="8-1">首页</el-menu-item>
							<el-menu-item index="8-2">代码仓库</el-menu-item>
							<el-menu-item index="8-3">个人中心</el-menu-item>
							<el-menu-item index="8-4" @click="controlObj.isDialog.isLoginOut = true">退出</el-menu-item>
						</el-sub-menu>
					</el-menu>
					<!-- tag标签,页眉标签 -->
					<el-tabs v-model="title" type="card" class="demo-tabs" @tab-remove="removeTab" @tab-click="toTab">
						<el-tab-pane v-for="item in tabs" :key="item.name" :label="item.title" :name="item.name"
							:closable="item.title == '首页' ? false : true">
						</el-tab-pane>
					</el-tabs>
				</el-header>
				<!-- 展示内容 -->
				<el-main style="background-color: #f8f8f8;overflow-x: hidden; ">
					<router-view />
				</el-main>
			</el-container>
		</el-container>
	</div>
	<!-- 遮罩层 -->
	<dialogPage>
		<div class="loginout" @click.stop>
			<div>
				<section>确定要退出吗?</section>
				<section>
					<button @click="confirm">确认</button>
					<button @click="controlObj.isDialog.isLoginOut = false">取消</button>
				</section>
			</div>
		</div>
	</dialogPage>
</template>

<script>
import centerPagescss from "@/public/center/centerPage.scss";
import dialogCss from "@/public/dialog/dialogPage.scss";

import databaseScss from "@/public/database/dataBase.scss";
import { ref, reactive, toRefs, onUpdated, provide, onBeforeMount } from "vue";
import { useRouter, useRoute } from "vue-router";
import { getMedical } from "@/api/arknight/database/home";
import controlObj from "@/hooks/controlObj";
import router from "@/router";
export default {
	name: "databasePage",
	setup() {
		onBeforeMount(() => {
			Promise.all([
				getMedical("expMedicals"),
				getMedical("basicMedical"),
				getMedical("naweiCompany"),
				getMedical("naweiCompany2"),
				getMedical("expMedical")])

		})
		let router = useRouter();
		let route = useRoute();
		// 控制面包屑内容
		let metaName = ref("");
		// 控制菜单栏折叠
		let isCollapse = ref(false);
		// 控制面包屑动画
		let isPlay = ref(false);
		// 控制刚进页面面包屑显隐
		let isbreadcrumb = ref(false);
		// 控制面包屑的内容展示，点击菜单某个页面后添加入数组
		let tabs = ref([
			{
				title: "首页",
				name: "首页",
				routeName: "homePage"
			}
		]);
		// 控制页眉的值，v-model绑定
		let title = ref("");
		// 路由数据
		let menu = JSON.parse(sessionStorage.getItem("menus"));
		let pages = reactive();
		// 在menu不为空后再获取路由信息
		if (menu != 0 && menu != null) {
			pages = menu.menu;
		}
		// uerId
		let userId = JSON.parse(localStorage.getItem("userMsg")).userId;


		onUpdated(() => {
			// 关闭面包屑动画
			setTimeout(() => {
				isPlay.value = false;
				console.log(isPlay)
			}, 250);

			// 判断当前页面的路径，显示面包屑的内容
			let newStr = route.fullPath.split("/")[2];
			switch (newStr) {
				case "system":
					metaName.value = "系统设置";
					break;
				case "fun":
					metaName.value = "功能";
					break;
				case "pages":
					metaName.value = "页面";
					break;
			}

			// 添加页眉
			// 通过当前路由的信息添加
			let newTabs = tabs.value.map((item) => item.title);
			if (!newTabs.includes(route.meta.title)) {
				tabs.value.push({
					title: route.meta.title,
					name: route.meta.title,
					routeName: route.name
				});
			}
			// 让高亮标题成为当前的标题显示
			title.value = route.meta.title;
		});
		// 跳转页面
		function toPage(index, index2) {
			// 控制点击之后才显示面包屑
			isbreadcrumb.value = true;
			// 为了控制一级和二级菜单的面包屑是否显示/显示的是哪一个菜单名
			route.meta.isHide = false;
			// 打开面包屑动画开关
			isPlay.value = true;
			console.log(isPlay)
			if (index2 == undefined) {
				// 调往首页
				router.push({
					name: pages[index].name,
					params: {
						userId
					}
				});
			} else {
				// 防止连续点击两次同个菜单后，面包屑隐藏
				route.meta.isHide = true;
				// 跳转其他二级路由
				router.push({
					name: pages[index].children[index2].name,
					params: {
						userId
					}
				});
			}
		}
		// 点击页眉跳转
		function toTab(name) {
			// 点击页眉跳转页面，开启面包屑动画
			isPlay.value = true;
			// 点击页眉，跳转页面
			tabs.value.forEach((item) => {
				if (item.title == name.paneName) {
					router.push({
						name: item.routeName,
						params: {
							userId
						}
					});
				}
			});
		}
		// 点击删除页眉
		function removeTab(targetName) {
			// 首页的页眉不能删除
			// if (targetName != "首页") {
			const newTabs = tabs.value;
			let activeName = title.value;
			// 判断当前删除的页眉是是否为高亮页眉
			if (activeName === targetName) {
				newTabs.forEach((item, index) => {
					if (item.name === targetName) {
						// 获取高亮页眉前一项或后一项，如果当前高亮页眉不为最后一项，则获取后一项，为最后一项就获取前一项
						const nextTab = newTabs[index + 1] || newTabs[index - 1];
						if (nextTab) {
							// 保存获取到的前一项或后一项页眉
							activeName = nextTab.name;
							// 跳转到高亮页眉
							toTab({ paneName: activeName });
						}
					}
				});
			}
			// 将点击删除的页眉过滤掉
			// 将前一项或后一项设置为高亮
			title.value = activeName;
			tabs.value = newTabs.filter((item) => item.name !== targetName);
			// 将过滤后剩下的页眉重新赋值
			tabs.value = reactive(tabs.value);
			// }
		}
		// 退出
		//点击遮罩层确认按钮
		const confirm = () => {
			Reflect.set(controlObj.isDialog, "isLoginOut", false);
			localStorage.removeItem("token");
			router.push({
				path: "/center/login"
			});
			router.go(0);
		};
		provide("controlDialog", "isLoginOut");

		return {
			/* 样式 */
			dialogCss,
			centerPagescss,
			databaseScss,
			/* 控制面包屑动画 */
			isPlay,
			/* 路由 */
			route,
			/* 控制刚进页面面包屑显隐 */
			isbreadcrumb,
			/* 控制菜单栏折叠 */
			isCollapse,
			/* 路由传参userId */
			userId,
			/* 控制面包屑内容 */
			metaName,
			/* 控制页眉的值 */
			title,
			/* 控制面包屑的内容展示 */
			tabs,
			/* 点击遮罩层确认按钮 */
			confirm,
			/* 点击页眉跳转 */
			toTab,
			/* 跳转页面 */
			toPage,
			/* 点击删除页眉 */
			removeTab,
			/* 存储数据 */
			...toRefs(reactive(JSON.parse(sessionStorage.getItem("menus")))),
			controlObj
		};
	},
	// 组件内守卫：进入该组件路由之前。目的：知道从哪个页面进来的
	// 页面导航拦截
	beforeRouteEnter(to, from, next) {
		if (from.name == "ToDatabase") {
			//前往home页面
			setTimeout(() => {
				router.push({
					name: "homePage",
					params: {
						userId: JSON.parse(localStorage.getItem("userMsg")).userId
					}
				})
			}, 50)
		}
		next();
	}
};
</script>

<style lang="scss" scoped>
.flex-grow {
	flex-grow: 1;
}

.el-header>ul {
	align-items: center;
}

.img {
	width: 30px;
	height: 30px;
	border: 1px solid;
	background-color: #ff00ff;
	border-radius: 50%;
}
</style>
