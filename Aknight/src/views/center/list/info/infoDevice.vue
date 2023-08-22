<template>
  <div style="height: 8.5rem"></div>
  <div class="infoDevice">
    <section class="btns">
      <button v-for="(item, index) in datas" :key="index" @click="changeActive(index)"
        :class="number == index ? 'active' : ''">
        {{ item.time }}
      </button>
    </section>
    <div class="content" v-for="(item, index) in (datas.length != 0 ? datas[number].children : '')" :key="index">
      <section class="title">{{ item.title }}</section>
      <div>
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
  </div>
</template>

<script>
import { getInfo } from '@/api/arknight/centerPage/personalList';
import { toRefs, ref } from 'vue'

export default {
  name: "infoDevice",
  setup() {
    let number = ref(0)
    //数字变为点击的按钮下标,渲染对应的数据
    const changeActive = (index) => {
      number.value = index
    }
    return {
      //数据请求
      ...toRefs(getInfo("infoDevice")),
      //点击按钮事件
      changeActive,
      number
    }
  }
}
</script>

<style lang="scss" scoped></style>
