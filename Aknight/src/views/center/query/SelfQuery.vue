<template>
  <div class="SelfQuery">
    <section>
      <img :src="datas.titleImg" alt="" /><span>{{ datas.title }}</span>
    </section>
    <div class="QueryItem">
      <section><span style="color: #158FC5;margin-right:0.5rem">UID</span><span>{{ UID }}</span></section>
      <section v-for="(item, index) in datas.items" :key="index">
        <!-- 按钮图标和文字 -->
        <button :style="{
          backgroundImage: `url(${item.titleImg})`
        }" @click="toPages(index)">{{ item.title }}</button>
      </section>
    </div>
  </div>
</template>

<script>
import { getSelfInquiries } from "@/api/arknight/centerPage/selfQuery";
import { toRefs } from "vue";
import { useRouter } from "vue-router";
export default {
  name: "SelfQuery",
  setup() {
    let UID = JSON.parse(localStorage.getItem("userMsg")).UID
    let router = useRouter()
    //路由名数组
    let route2 = ["reChargePage", "exclusivePage", "sourcePage"]
    //点击跳转路由,根据下标跳转到对应页面
    function toPages(index) {
      router.push({
        name: route2[index],
        query: {
          index
        }
      })
    }
    return {
      //本地获取的UID
      UID,
      //点击跳转
      toPages,
      //页面数据
      ...toRefs(getSelfInquiries())
    };
  }
};
</script>

<style lang="scss" scoped></style>
