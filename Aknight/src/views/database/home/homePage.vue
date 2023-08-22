<template>
  <div class="home-box">
    <!-- 头部(四个盒子) -->
    <div class="header">
      <div v-for="(item, index) in menus" :key="index" class="centbox">
        <div class="msg">
          <section>
            <span>{{ item.number }}</span>
            <span :style="{
              color: item.rate.includes('-') ? 'rgb(255, 100, 98)' : 'rgb(102, 144, 249',
              fontSize: '16px',
              marginLeft: '5px'
            }">{{ item.rate }}</span>
          </section>
          <section>
            <span>{{ item.word }}</span>
          </section>
        </div>
        <div class="cricle"></div>
      </div>
    </div>
    <div class="center">
      <!-- 靶向药实验数据的复合折线统计图 -->
      <div id="expMedicals"></div>
      <!-- 各公司所持有的靶向药数据，环状图 -->
      <div id="basicMedical"></div>
    </div>
    <div class="footer">
      <div class="tool">
        <div class="tool-box">
          <dir class="title">快捷导航工具</dir>
          <div>
            <div v-for="(item, index) in tools" :key="index" class="tools">
              <section>{{ item.word }}</section>
              <section>{{ item.data }}</section>
            </div>
          </div>
        </div>
      </div>
      <!-- 纳微公司的营销利润与增长率，折柱复合统计图 -->
      <div id="naweiCompany"></div>
    </div>
  </div>
</template>

<script>
import home from "@/public/database/home/home.scss";
import { expMedicals, basicMedical, naweiCompany } from "@/echarts"
import { onMounted, toRefs } from 'vue';
import { getMessages, getNavTools } from '@/api/arknight/database/home';
export default {
  name: "homePage",
  setup() {
    // 列表的引入
    onMounted(() => {
      //靶向药实验数据的复合折线统计图
      //各公司所持有的靶向药数据，环状图
      //纳微公司的营销利润与增长率，折柱复合统计图
      Promise.all([
        expMedicals(document.querySelector("#expMedicals")),
        basicMedical(document.querySelector("#basicMedical")),
        naweiCompany(document.querySelector("#naweiCompany"))])
    })
    return {
      //样式
      home,
      //页面数据请求
      ...toRefs(getMessages()),
      ...toRefs(getNavTools())
    };
  },
};
</script>

<style lang="scss" scooped></style>
