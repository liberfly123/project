import { createStore } from "vuex";
import personalCenter from "./modules/personalCenter";
import createPersistedState from 'vuex-persistedstate'
import { isStore } from '@/hooks/store';
import dataBase from "./modules/dataBase";

export default createStore({
	plugins: [
		//登录时开启
		createPersistedState({
			storage: window.localStorage,
			reducer(state) {
				let loginObj = {
					token: state.personalCenter.token,
					telephone: state.telephone,
					realTelephone: state.realTelephone
				};
				return isStore(state, "token", "isLogin", loginObj, localStorage);
			},
			key: "token",
		}),
		//调用吐丝时开启
		createPersistedState({
			storage: window.sessionStorage,
			reducer(state) {
				return { msg: state.msg }
			},
			key: "msg",
		}),
		//注册时开启
		createPersistedState({
			storage: window.localStorage,
			reducer(state) {
				let registerObj = {
					userId: state.personalCenter.userId,
					UID: state.personalCenter.UID,
					ID: state.personalCenter.ID,
					email: state.personalCenter.email,
					fullName: state.personalCenter.fullName,
				};
				return isStore(state, "userMsg", "isRegister", registerObj, localStorage);
			},
			key: "userMsg",
		}),
		//buffer页面开启
		createPersistedState({
			storage: window.sessionStorage,
			reducer(state) {
				let menuObj = {
					menus: state.personalCenter.menus,
					menuRoutes: state.personalCenter.menuRoutes
				};
				return isStore(state, "menu", "isMenu", menuObj, sessionStorage);
			},
			key: "menu",
		}),
		//baseMsg页面开启
		createPersistedState({
			storage: window.sessionStorage,
			reducer(state) {
				let baseMsgObj = {
					baseMsg: state.personalCenter.baseMsg
				};
				return isStore(state, "baseMsg", "isBaseMsg", baseMsgObj, sessionStorage);
			},
			key: "baseMsg",
		}),
		//exChangeGift页面兑换时开启(要有历史记录,因此使用localStorage)
		createPersistedState({
			storage: window.localStorage,
			reducer(state) {
				let contextObj = {
					contexts: state.personalCenter.contexts
				};
				return isStore(state, "context", "isContext", contextObj, localStorage);
			},
			key: "context",
		}),
		//selfQuery页面开启
		createPersistedState({
			storage: window.sessionStorage,
			reducer(state) {
				let selfQueryObj = {
					selfQuery: state.personalCenter.selfQuery
				};
				return isStore(state, "selfQuery", "isSelfQuery", selfQueryObj, sessionStorage);
			},
			key: "selfQuery",
		}),
		//databse页面开启
		createPersistedState({
			storage: window.sessionStorage,
			reducer(state) {
				let menusObj = {
					menu: state.dataBase.menu,
					menuRoutes: state.dataBase.menuRoutes
				};
				return isStore(state, "menus", "isMenus", menusObj, sessionStorage);
			},
			key: "menus",
		}),
		//dataBase页面开启
		createPersistedState({
			storage: window.sessionStorage,
			reducer(state) {
				let medicalObj = {
					expMedicals: state.dataBase.expMedicals,
					basicMedical: state.dataBase.basicMedical,
					naweiCompany: state.dataBase.naweiCompany,
					naweiCompany2: state.dataBase.naweiCompany2,
					expMedical: state.dataBase.expMedical
				};
				return isStore(state, "medical", "isMedical", medicalObj, sessionStorage);
			},
			key: "medical",
		}),
	],
	state: {
		msg: null, // 保存吐丝信息
		countDown: 120, //验证码倒计时数字,
		telephone: null,//带*号的手机号
		realTelephone: null,//真实显示的手机号
		control: {
			// vuex,控制存储条件集合
			isRegister: false, //注册条件，
			isLogin: false,//登录条件
			isMenu: false,//buffer页面触发
			isBaseMsg: false,//baseMsg页面触发
			isContext: false,//exChangeGift页面触发
			isSelfQuery: false,//selfQuery页面触发
			isMenus: false,//database页面触发
			isMedical: false,//home页面触发
		}
	},
	getters: {},
	mutations: {
		//调用吐丝存信息
		changeMsg(state, data) {
			state.msg = data;
		},
		changeStore(state, name) {
			// 将条件设置为true
			Reflect.set(state.control, name, true);
			// 500秒后设置为false，否者刷新后还是会丢失，
			setTimeout(() => {
				Reflect.set(state.control, name, false);
			}, 200);
		},
		//登录存telephone(带*)
		changeTel(state, data) {
			state.telephone = data
		},
		//登录存realTelephone(真实显示的)
		changeRealTel(state, data) {
			state.realTelephone = data
		}
	},
	actions: {},
	namespaced: true,
	modules: {
		//个人中心子仓库
		personalCenter,
		//数据库子仓库
		dataBase
	}
});
