<script setup lang="ts">
import { getIndexDatas } from '@/api/animation'

// 请求图片数据
let { img } = await getIndexDatas('images')
</script>

<template>
  <div class="animation">
    <!-- 背景 -->
    <div
      class="bg"
      :style="{
        backgroundImage: `url(${img.scene})`
      }"
    ></div>
    <!-- 动画页面的进度条 -->
    <div class="progress">
      <div>
        <hr />
        <div></div>
      </div>
      <div>
        <div></div>
        <hr />
      </div>
    </div>
  </div>
</template>

<style scoped>
/*导入animation动画样式*/
@import '@/assets/animation.scss';
</style>
