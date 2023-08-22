import { reactive } from "vue";
// 控制条件的对象
let controlObj = reactive({
	isChange: false, // 切换注册登录
	isPlay: false, // 是否播放旋转动画
	isCode: false, // 切换短信密码登录
	isChecked: false, // 是否同意协议的状态
	isDialog: {
		// 遮罩层状态
		isLoginIn: false, //登录注册的倒计时遮罩层
		isLoginOut: false, //登出状态的遮罩层
		isChangeInfo: false, //更改数据页面的遮罩层
		isAddMenu: false,//控制各管理页面的新增/修改菜单遮罩层
	},
	isRegister: true, // 是否能够注册
	isLogin: true, // 是否能够登录
	isTusi: false, // 展示吐丝弹窗的状态
	isDisabled: false, //获取验证码按钮是否可用
	isChangeTel: false //分离更改新旧手机号
});

export default controlObj;
