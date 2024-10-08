<script setup>
import BackTop from "@/components/BackTop.vue";
</script>

<template>

  <div class="box">
    <RouterView />

    <BackTop />
  </div>

</template>

<style scoped>
.box {
    width: 100%;
    min-height: 100vh;
    background-color: #eef0f4;
}
</style>
