<!-- 遮罩层封装 -->
<template>
    <Teleport to="body">
        <div class="masked" v-show="controlObj.isDialog[controlDialog]" @click="ceale">
            <slot></slot>
        </div>
    </Teleport>
</template>

<script>
import controlObj from '@/hooks/controlObj';
import { inject } from 'vue';
export default {
    name: "dialogPage",
    setup() {
        //接收外部传入的对应遮罩层按钮按钮
        let controlDialog = inject("controlDialog")
        //点击页面取消遮罩层
        function ceale() {
            Reflect.set(controlObj.isDialog, controlDialog, false)
        }

        return {
            //点击页面取消遮罩层
            ceale,
            //按钮集合
            controlObj,
            //传入的遮罩层按钮
            controlDialog
        }
    }
}
</script>

<style lang="scss" scoped>
.masked {
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 9;
}
</style>@/hooks/controlObj