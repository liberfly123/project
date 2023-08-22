<template>
  <div class="inof">
    <!-- 内容框 -->
    <div v-for="(item, index) in datas" :key="index">
      <!-- 标题部分 -->
      <section>
        <img :src="item.title.img" alt="">
        <span style="color: #000">{{ item.title.word }}</span>
      </section>
      <!-- 具体内容部分 -->
      <section v-for="(item1, index1) in item.inputs" :key="index1">
        <p>{{ item1.inputTitle }}</p>
        <input v-if="index1 < 2" type="text" :value="item1.inputItem" readonly>
        <button v-if="index1 < 2 ? (index == 1 ? (index1 == 0 ? true : false) : true) : fasle"
          @click="changeInof(item1.name, item1.inputTitle)">变更</button>
        <button v-if="index1 == 2" style="width:100%; margin: 1vh 0;">清除其他设备的登入状态</button>
        <span v-if="index1 == 2">{{ item1.inputItem }}</span>
      </section>
    </div>
  </div>
</template>

<script>
import baseCss from '@/public/personalCenter/baseMsg/baseMsg.scss'
import { getBaseMsg } from '@/api/arknight/centerPage/baseMsg';
import { reactive, toRefs } from 'vue'
import { useRoute, useRouter } from 'vue-router'
export default {
  name: "BaseMessage",
  setup() {
    const route = useRoute()
    const router = useRouter()
    //请求页面信息所需的数据
    let data = reactive({
      telephone: "",
      userId: ""
    })
    data.telephone = JSON.parse(localStorage.getItem("token")).telephone
    data.userId = route.params.userId

    //跳转更改数据页面
    //传的参:index 对应div(盒子) index1:对应section(按钮位置) name:请求数据中的英文(可以用于找到请求路径,形成动态请求) 
    const changeInof = (name, title) => {
      router.push({
        name: "changeInfo",
        params: {
          userId: data.userId
        },
        query: {
          name,
          title
        }
      })
    }
    return {
      //样式
      baseCss,
      //页面数据
      ...toRefs(getBaseMsg(data)),
      //跳转对应更改页面
      changeInof
    }
  }
}
</script>

<style lang="scss" scoped></style>
