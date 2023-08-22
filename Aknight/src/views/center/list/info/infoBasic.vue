<template>
  <div style="height: 8.5rem"></div>
  <div class="ThirdShare" v-for="(item, index) in datas" :key="index">
    <section class="title">{{ item.title }}</section>
    <div class="content">
      <section>
        <span>收集场景</span>
        <span>{{ item.scene }}</span>
      </section>
      <section>
        <span>收集目的</span>
        <span>{{ item.target }}</span>
      </section>
      <section>
        <span>信息内容及数量</span>
        <span>{{ item.item }}</span>
      </section>
    </div>
  </div>
</template>

<script>
import { getInfo } from '@/api/arknight/centerPage/personalList';
import { toRefs } from 'vue'

export default {
  name: "infoBasic",
  setup() {

    return {
      //数据请求
      ...toRefs(getInfo("infoBasic"))
    }
  }
}
</script>

<style lang="scss" scoped></style>
