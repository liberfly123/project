<template>
  <div class="inof" style=" grid-template-rows: 1fr;">
    <div>
      <section>
        <span style="color: #000">重置密码</span>
      </section>
      <section v-for="(item, index) in pwdArr" :key="index">
        <p>{{ item.title }}</p>
        <input :type="item.type" :placeholder="item.placeHolder" v-model="item.value"
          :id="item.isShow ? 'inputRej' : 'inputRes'" :style="{
            width: index == 3 ? '64%' : '100%',
            backgroundColor: item.isShow ? '#FFDCDB' : 'rgba(255,255,255,0)'
          }" />
        <button v-if="index == 3" @click="getTelCode">获取验证码</button>
        <!-- 错误提示区 -->
        <p class="errMsg" :style="{
          visibility: item.isShow ? 'visible' : 'hidden',
          fontSize: '12px',
          color: '#f00',
          fontWeight: 'normal'
        }">
          {{ item.value == "" ? item.tip01 : item.tip02 }}
        </p>
      </section>
      <section>
        <button @click="changePwd" style="width:100%;">确认更改</button>
      </section>
    </div>
  </div>
  <!-- 吐丝 -->
  <messagePage v-if="controlObj.isTusi"></messagePage>
</template>

<script>
import baseCss from '@/public/personalCenter/baseMsg/baseMsg.scss'
import { reactive } from 'vue'
import { observer } from "@/hooks/personalCenter/watcher";
import { getCode, setMsg } from '@/api/arknight/centerPage/resetPsw';
import controlObj from "@/hooks/controlObj";
import { toest } from "@/hooks/toset";

export default {
  name: "ResetPassword",
  setup() {
    //输入框渲染数组
    let pwdArr = reactive([
      {
        title: "旧密码",
        value: "",
        isShow: false,
        type: "password",
        placeHolder: "请输入旧密码",
        tip01: "*旧密码不能为空",
        tip02: "*旧密码格式不正确",
        zz: /^\w{8,16}$/,
        use: "旧密码"
      },
      {
        title: "新密码",
        value: "",
        isShow: false,
        type: "password",
        placeHolder: "8-16位数字、字母、常用字符",
        tip01: "*密码不能为空",
        tip02: "*密码格式不正确",
        zz: /^\w{8,16}$/,
        use: "新密码"
      },
      {
        title: "确认密码",
        value: "",
        isShow: false,
        type: "password",
        placeHolder: "确认密码",
        tip01: "*请确认密码",
        tip02: "*两次输入的密码不一致",
        use: "确认密码"
      },
      {
        title: "验证码",
        value: "",
        isShow: false,
        type: "text",
        placeHolder: "输入验证码",
        tip01: "*验证码不能为空",
        tip02: "*验证码格式不正确",
        zz: /^\d{4}$/,
        use: "旧手机验证码"
      }
    ]);
    //监听数组数据变化和校正
    observer(pwdArr)

    let userId = JSON.parse(localStorage.getItem("userMsg")).userId
    //点击自动发送短信验证码
    const getTelCode = () => {
      getCode({
        userId: userId,
        telephone: JSON.parse(localStorage.getItem("token")).realTelephone
      })
    }
    //确认修改密码
    const changePwd = () => {
      setMsg({
        newPassword: pwdArr[0].value,
        oldPassword: pwdArr[1].value,
        code: pwdArr[2].value,
        userId: userId
      })
      //调用吐丝
      toest(controlObj)
    }
    return {
      //样式
      baseCss,
      //输入框渲染数组
      pwdArr,
      //点击自动发送短信
      getTelCode,
      //确认更改密码
      changePwd,
      //按钮集合
      controlObj
    }
  }
}
</script>

<style lang="scss" scoped></style>
