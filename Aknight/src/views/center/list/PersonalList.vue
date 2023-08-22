<template>
  <div class="list">
    <div v-for="(item, index) in listArr" :key="index" @click="listInfo(index)">
      <section>
        <span>{{ item }}</span>
      </section>
      <section>
        <span>查看</span>
        <span class="arrow"></span>
      </section>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
export default {
  name: "PersonalList",
  setup() {
    const router = useRouter()
    //渲染数组
    let listArr = ["个人基本信息", "实名信息", "用户行为信息", "设备属性及定位信息"]
    //路由名数组
    let routes = ["infoBasic", "infoRePage", "infoRePage", "infoDevice"]
    //点击跳转对应的页面,并用下标进行区分
    const listInfo = (index) => {
      router.push({
        name: routes[index],
        query: {
          index
        }
      })
    }
    return {
      //渲染数组
      listArr,
      //点击事件
      listInfo
    }
  }
}
</script>

<style lang="scss" scoped></style>
