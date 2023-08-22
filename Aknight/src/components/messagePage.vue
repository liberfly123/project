<!-- 吐丝封装 -->
<template>
    <div>
        <section class="tusi" :style='{
            backgroundColor: tusi.status == 1 ? "#FE1610" : "#0CB751"
        }'>
            {{ tusi.status == 1 ? tusi.msg : tusi.message }}
        </section>

    </div>
</template>

<script>
import controlObj from '@/hooks/controlObj'
import { reactive, watch } from 'vue'
export default {
    name: "messagePage",
    setup() {
        let tusi = reactive({});
        const storedMsg = JSON.parse(sessionStorage.getItem('msg')).msg;
        // 监听 controlObj.isTusi 的变化
        watch(() => controlObj.isTusi, (newVal) => {
            if (newVal) {
                Object.assign(tusi, storedMsg || {});
                setTimeout(() => {
                    controlObj.isTusi = false;
                }, 2000);
            }
        }, { immediate: true })
        return {
            tusi
        }
    }
}
</script>

<style lang="scss" scoped>
.tusi {
    width: 200px;
    border-radius: 1vw;
    position: absolute;
    left: 43vw;
    top: 12vh;
    color: #fff;
    text-align: center;
    padding: 0.5vw;

}
</style>