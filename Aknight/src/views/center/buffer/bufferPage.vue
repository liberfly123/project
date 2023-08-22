<!-- 过渡组件 -->
<template>
    <div>
    </div>
</template>

<script>
import { centerMenu } from '@/api/arknight/centerPage/routes';
import { onBeforeRouteLeave, useRouter } from 'vue-router'
export default {
    name: "bufferPage",
    setup() {
        const router = useRouter()
        //请求BaseMessage页面数据
        centerMenu()
        //组件内离开时触发的守卫
        onBeforeRouteLeave(() => {
            //刷新页面
            setTimeout(()=>{
                router.go(0)
            },50)
        })
        return {}
    }
}
</script>

<style lang="scss" scoped></style>