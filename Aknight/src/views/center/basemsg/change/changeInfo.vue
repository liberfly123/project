<template>
  <div class="inof" style=" grid-template-rows: 1fr;height:80%;margin:0;">
    <div>
      <!-- 动态标题 -->
      <section>
        <span style="color: #000">{{ title }}</span>
      </section>
      <section v-for="(item, index) in changeArr" :key="index">
        <!-- 输入框标题 -->
        <p>{{ item.title }}</p>
        <input :type="item.type" v-model="item.value" :placeholder="item.placeHolder"
          :id="item.isShow ? 'inputRej' : 'inputRes'" :style="{
            width: index == 1 || index == 3 ? '64%' : '100%',
            backgroundColor: item.isShow ? '#FFDCDB' : 'rgba(255,255,255,0)'
          }">
        <!-- 旧手机按钮 -->
        <button v-if="index == 1" @click="getMathCode('isChangeInfo', 'isChangeTel', index)"
          :class="countDown.nameArr.includes('isOldPhone') ? 'disabled' : ''"
          :disabled="countDown.nameArr.includes('isOldPhone')">
          {{
            countDown.nameArr.includes("isOldPhone")
            ? countDown.numberOldPhone + "S 后重试" : "获取验证码"
          }}
        </button>
        <!-- 新手机按钮 -->
        <button v-if="index == 3" @click="getMathCode('isChangeInfo', 'isChangeTel', index)"
          :class="countDown.nameArr.includes('isNewPhone') ? 'disabled' : ''"
          :disabled="countDown.nameArr.includes('isNewPhone')">
          {{
            countDown.nameArr.includes("isNewPhone")
            ? countDown.numberNewPhone + "S 后重试" : "获取验证码"
          }}
        </button>
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
        <button style="width:100%; margin: 1vh 0;" @click="changeInfo(route.query.name)">确认更改</button>
      </section>
    </div>
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
          <button @click="confirm(controlObj.isChangeTel ? 'isNewPhone' : 'isOldPhone')">
            确认
          </button>
          <button @click="cancel('isChangeInfo')">取消</button>
        </section>
      </div>
    </div>
  </dialogPage>
</template>

<script>
import baseCss from '@/public/personalCenter/baseMsg/baseMsg.scss'
import { reactive, provide } from 'vue'
import { useRoute } from 'vue-router'
import { observer } from "@/hooks/personalCenter/watcher";
import { getMathCode, setCountDown, changeSvg, cancel } from "@/hooks/personalCenter/code";
import dialogCss from "@/public/dialog/dialogPage.scss";
import controlObj from "@/hooks/controlObj";
import svg from "@/hooks/personalCenter/code";
import { setMsg } from '@/api/arknight/centerPage/baseMsg';
import url from "@/api/url";
import { toest } from "@/hooks/toset";

export default {
  name: "changeInfo",
  setup() {
    const route = useRoute()
    let userId = route.params.userId
    let title = route.query.title
    //旧手机号
    let telephone = JSON.parse(localStorage.getItem("token")).telephone
    //渲染数组(输入框)
    let changeArr = reactive([
      {
        title: `验证当前手机号(${telephone})`,
        value: '',
        isShow: false,
        type: "tel",
        placeHolder: "请输入手机号",
        tip01: "*手机号码不能为空",
        tip02: "*手机号码格式不正确",
        zz: /^1{1}[3-9]{1}\d{9}$/,
        use: "手机号"
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
      },
      {
        title: `修改${title}`,
        value: "",
        isShow: false,
        type: "text",
        placeHolder: `请输入${title}`,
        tip01: `*${title}不能为空`,
        tip02: `*${title}格式不正确`,
        zz: title == '绑定手机' ? /^1{1}[3-9]{1}\d{9}$/ :
          title == '绑定邮箱' ? /^\w{1,}@{1}(qq.com)?(163.com)?(sina.com)?(outlook.com)?(foxmail.com)?$/ :
            title == '实名信息' ? /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
              : /\S{1,}/,
        use: `${title}`
      },
    ])
    //换绑手机号添加一个输入框
    if (title == "绑定手机") {
      changeArr.push({
        title: "验证码",
        value: "",
        isShow: false,
        type: "text",
        placeHolder: "输入验证码",
        tip01: "*验证码不能为空",
        tip02: "*验证码格式不正确",
        zz: /^\d{4}$/,
        use: "新手机验证码"
      })
    }
    //监听数组变化和校正
    observer(changeArr)
    //插槽
    provide("controlDialog", "isChangeInfo");
    //验证码倒计时
    let { getCode, countDown, confirm } = setCountDown("isChangeInfo", changeArr);
    //点击更改按钮请求更改数据
    const changeInfo = (name) => {
      //请求所需
      let data = reactive({
        oldTelephone: changeArr[0].value,
        code: changeArr[1].value,
        userId: userId,
        [name]: changeArr[2].value
      })
      //更改请求所需的data动态键名
      if (title == "绑定手机") {
        data = JSON.parse(JSON.stringify(data).replace(/telephone/g, "newTelephone"))
      }
      //请求
      setMsg(url.centerPage.baseMsg[name], data)
      //吐丝
      toest(controlObj);
    }

    return {
      //样式
      baseCss,
      dialogCss,
      //输入框渲染数据
      changeArr,
      //标题
      title,
      //解构验证码倒计时函数之后得到的
      getCode,
      countDown,
      confirm,
      //按钮集合
      controlObj,
      //获取验证码
      getMathCode,
      //切换验证码
      changeSvg,
      //取消遮罩层
      cancel,
      //验证码svg图片
      svg,
      route,
      //确认更改
      changeInfo
    }
  }
}
</script>

<style lang="scss" scoped></style>
