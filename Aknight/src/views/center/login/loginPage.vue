<template>
	<div class="login" :style="{
		// 判断是否播放
		animation: !controlObj.isPlay
			? ''
			: controlObj.isChange // 播放的是哪一个框(注册框/登录框)的动画
				? 'toRegister 0.5s 0.05s 1 ease-in forwards'
				: 'toLogin 0.5s 0.05s 1 ease-in forwards'
	}">
		<!-- 标题 -->
		<h2>{{ controlObj.isChange ? "注册" : "登录" }}</h2>
		<div v-for="(item, index) in loginArr" :key="index">
			<!-- 输入框区 -->
			<section class="userInput">
				<input v-model="item.value" :type="item.type" :placeholder="item.placeHolder"
					:id="item.isShow ? 'inputRej' : 'inputRes'" :style="{
						backgroundColor: item.isShow ? '#FFDCDB' : 'rgba(255,255,255,0)'
					}" />
				<button v-if="item.isRender" @click="getMathCode('isLoginIn')" :class="controlObj.isChange ? countDown.nameArr.includes('isRegister') ? 'disabled' : ''
					: countDown.nameArr.includes('isLogin') ? 'disabled' : ''"
					:disabled="controlObj.isChange ? countDown.nameArr.includes('isRegister') : countDown.nameArr.includes('isLogin')">
					{{
						controlObj.isChange ? countDown.nameArr.includes("isRegister")
						? countDown.numberRegister + "S 后重试" : "获取验证码"
						: countDown.nameArr.includes("isLogin")
							? countDown.numberLogin + "S 后重试" : "获取验证码"
					}}
				</button>
			</section>
			<!-- 错误提示区 -->
			<section :style="{
							visibility: item.isShow ? 'visible' : 'hidden',
							fontSize: '12px',
							color: '#f00',
							boxSizing: 'border-box'
						}">
				{{ item.value == "" ? item.tip01 : item.tip02 }}
			</section>
		</div>
		<!-- 按钮区 -->
		<div class="btns">
			<section @click="loginMethod(loginArr, addArr)">
				<span v-if="controlObj.isChange">
					<input type="checkbox" style="width: 12px; vertical-align: middle; margin-right: 5px"
						v-model="controlObj.isChecked" @click="controlObj.isChecked = !controlObj.isChecked" />
				</span>
				<!-- 切换登录方式 -->
				<span :style="{
					color: controlObj.isChange ? '#000' : '#158fc5'
				}">{{ controlObj.isChange ? "已阅读并同意" : controlObj.isCode ? "使用密码登录" : "使用短信验证码登录" }}</span>
				<span v-if="controlObj.isChange">《鹰角网络用户注册协议》</span>
				<span v-if="controlObj.isChange" style="color: #000">及</span>
				<span v-if="controlObj.isChange">《鹰角网络游戏个人信息保护政策》</span>
			</section>
			<section>
				<button :style="{ marginBottom: controlObj.isChange ? '0' : '' }" @click="registerOrLogin">
					{{ controlObj.isChange ? "注册" : "登录" }}
				</button>
			</section>
			<section v-if="!controlObj.isChange">使用bilibili登录</section>
		</div>
	</div>
	<!-- 切换登录注册框 -->
	<div class="change-box">
		<span :class="controlObj.isChange ? '' : 'checked'"
			@click="changeBoard(loginArr, controlObj, false, loginArr.length > 3)">登录</span>
		<span>·</span>
		<span :class="controlObj.isChange ? 'checked' : ''"
			@click="changeBoard(loginArr, controlObj, true, loginArr.length < 3, addArr)">注册</span>
	</div>
	<!-- 吐丝 -->
	<messagePage v-if="controlObj.isTusi"></messagePage>
	<!-- 遮罩层 -->
	<dialogPage>
		<div class="mathcode" @click.stop>
			<div>
				<section>
					<input type="text" placeholder="请输入结果" v-model="getCode.mathCode" />
					<span v-html="svg.codes" @click="changeSvg"></span>
				</section>
				<section>
					<button @click="confirm(controlObj.isChange ? 'isRegister' : 'isLogin')">
						确认
					</button>
					<button @click="cancel('isLoginIn')">取消</button>
				</section>
			</div>
		</div>
	</dialogPage>
	<!-- 路由视图，显示子路由 -->
	<router-view></router-view>
</template>

<script>
import { provide, reactive } from "vue";
import controlObj from "@/hooks/controlObj";
import { observer } from "@/hooks/personalCenter/watcher";
import { loginMethod } from "@/hooks/personalCenter/loginMethod";
import { changeBoard } from "@/hooks/personalCenter/changeBoard";
import { getMathCode, setCountDown, changeSvg, cancel } from "@/hooks/personalCenter/code";
import dialogCss from "@/public/dialog/dialogPage.scss";
import svg from "@/hooks/personalCenter/code";
import { userPass } from "@/hooks/personalCenter/userPass";
import { createNamespacedHelpers } from "vuex";

export default {
	name: "loginPage",
	setup() {
		const { mapMutations } = createNamespacedHelpers("personalCenter");
		//初始输入框数组
		let loginArr = reactive([
			{
				value: "",
				isShow: false,
				type: "tel",
				placeHolder: "请输入手机号",
				tip01: "*手机号码不能为空",
				tip02: "*手机号码格式不正确",
				zz: /^1{1}[3-9]{1}\d{9}$/,
				use: "手机号"
			},
			{
				value: "",
				isShow: false,
				type: "password",
				placeHolder: "请输入密码",
				tip01: "*密码不能为空",
				tip02: "*密码格式不正确",
				zz: /^\w{8,16}$/,
				use: "密码"
			}
		]);
		//用于添加和修改的数组
		let addArr = reactive([
			{
				value: "",
				isShow: false,
				type: "password",
				placeHolder: "请输入密码",
				tip01: "*密码不能为空",
				tip02: "*密码格式不正确",
				zz: /^\w{8,16}$/,
				use: "密码"
			},
			{
				value: "",
				isShow: false,
				type: "password",
				placeHolder: "确认密码",
				tip01: "*请确认密码",
				tip02: "*两次输入的密码不一致",
				use: "确认密码"
			},
			{
				value: "",
				isShow: false,
				type: "text",
				placeHolder: "输入验证码",
				tip01: "*验证码不能为空",
				tip02: "*验证码格式不正确",
				zz: /^\d{4}$/,
				isRender: true,
				use: "验证码"
			}
		]);
		//监视输入框变化
		observer(loginArr);
		//给遮罩层组件传对应遮罩层按钮
		provide("controlDialog", "isLoginIn");
		//定时器倒计时
		let { getCode, countDown, confirm } = setCountDown("isLoginIn", loginArr);

		// 登录和注册
		function registerOrLogin() {
			//判断是注册还是登录
			controlObj.isChange ?
				//注册
				userPass(loginArr, "register", "changeUserMsg", mapMutations) :
				//登录=>同时要区分是密码登录/短信登录
				userPass(loginArr, (controlObj.isCode ? "codeLogin" : "login"), "changeToken", mapMutations)
		}

		return {
			//样式
			dialogCss,
			//渲染数组
			loginArr,
			addArr,
			//按钮集合
			controlObj,
			//验证码svg图片
			svg,
			//切换登录方式
			loginMethod,
			//切换登录注册框
			changeBoard,
			//点击获取验证码
			getMathCode,
			//切换验证码
			changeSvg,
			//遮罩层取消按钮
			cancel,
			//解构验证码倒计时函数之后得到的
			getCode,
			countDown,
			confirm,
			//点击登录/注册
			registerOrLogin
		};
	}
};
</script>

<style lang="scss" scoped></style>
