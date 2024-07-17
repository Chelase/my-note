<script setup>
import { ref, onBeforeUnmount} from 'vue'
import router from "@/router/index.js";

const count = ref(3)

const timer = setInterval(() => {
  count.value -= 1
  if (count.value === 0) router.push('/')
},1000)

onBeforeUnmount(() => {
  clearInterval(timer)
})
</script>

<template>
  <div class="container">
    <el-empty description="404 NotFound" class="">
      <p>还剩{{count}}秒返回首页</p>
      <el-button type="primary" @click="$router.push('/')">返回首页</el-button>
    </el-empty>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}
</style>