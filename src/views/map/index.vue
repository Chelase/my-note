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
    plugins: [
      "AMap.Scale",
      'AMap.ToolBar',
      'AMap.ControlBar',
      'AMap.Geolocation',
      'AMap.AutoComplete',
      'AMap.PlaceSearch',
      'AMap.Driving',
      'AMap.Riding',
      'AMap.DragRoute',
      'AMap.CitySearch',
      'AMap.MouseTool',
      'AMap.MarkerCluster',
      'AMap.Weather'
    ], //需要使用的的插件列表，如比例尺'AMap.Scale'，支持添加多个如：['...','...']
  })
      .then((AMap) => {
        map = new AMap.Map("map", {
          // 设置地图容器id
          resizeEnable: true,
          rotateEnable: true, //是否开启地图旋转交互 鼠标右键 + 鼠标画圈移动 或 键盘Ctrl + 鼠标左键画圈移动
          pitchEnable: true, //是否开启地图倾斜交互 鼠标右键 + 鼠标上下移动或键盘Ctrl + 鼠标左键上下移动
          viewMode: '3D', //地图模式
          zoom: 10, //初始化地图层级
          zooms: [2, 20], //地图显示的缩放级别范围
          mapStyle: 'amap://styles/b691f88f67c5df7d037d8a5d79239f67',
        });
        const toolbar = new AMap.ToolBar(); //创建插件实例
        const scale = new AMap.Scale();
        const controlBar = new AMap.ControlBar({
          position:{
            right:'10px',
            top:'10px'
          }
        });
        map.addControl(toolbar); //添加插件到页面
        map.addControl(scale);
        map.addControl(controlBar);
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