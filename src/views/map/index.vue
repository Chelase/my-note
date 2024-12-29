<script setup>
import { onMounted, onUnmounted } from "vue";
import AMapLoader from "@amap/amap-jsapi-loader";

let map = null;

const key = import.meta.env.VITE_APP_MAP_KEY
const secretKey = import.meta.env.VITE_APP_MAP_SECRET_KEY

onMounted(() => {
  window._AMapSecurityConfig = {
    securityJsCode: secretKey,
  };
  AMapLoader.load({
    key: key, // 申请好的Web端开发者Key，首次调用 load 时必填
    version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    plugins: ["AMap.Scale"], //需要使用的的插件列表，如比例尺'AMap.Scale'，支持添加多个如：['...','...']
  })
      .then((AMap) => {
        map = new AMap.Map("map", {
          // 设置地图容器id
          resizeEnable: true,
          // viewMode: "3D", // 是否为3D地图模式
          zoom: 11, // 初始化地图级别
        });
      })
      .catch((e) => {
        console.log(e);
      });
});

onUnmounted(() => {
  map?.destroy();
});
</script>

<template>
  <div id="map"></div>
</template>

<style scoped>
#map {
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100vh;
}
</style>