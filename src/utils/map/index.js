const plugins = [
    'AMap.Scale', // 比例尺，显示当前地图中心的比例尺
    'AMap.ToolBar', // 工具条，控制地图的缩放、平移等
    'AMap.ControlBar', // 组合了旋转、倾斜、复位在内的地图控件
    'AMap.Geolocation', // 浏览器定位，提供了获取用户当前准确位置、所在城市的方法
    'AMap.AutoComplete', // 输入提示，提供了根据关键字获得提示信息的功能
    'AMap.PlaceSearch', // 地点搜索服务，提供了关键字搜索、周边搜索、范围内搜索等功能
    'AMap.Driving', // 驾车路线规划服务，提供按照起、终点进行驾车路线的功能
    'AMap.Riding', // 骑行路线规划服务，提供按照起、终点进行骑行路线的功能
    'AMap.DragRoute', // 拖拽导航插件，可拖拽起终点、途经点重新进行路线规划
    'AMap.CitySearch', // 城市获取服务，获取用户所在城市信息或根据给定IP参数查询城市信息
    'AMap.MouseTool', // 鼠标工具插件，用于鼠标画标记点、线、多边形、矩形、圆、距离量测、面积量测、拉框放大、拉框缩小等功能
    'AMap.MarkerCluster', // 点聚合插件，用于展示大量点标记，将点标记按照距离进行聚合，以提高绘制性能
    'AMap.Weather', // 天气预报插件，用于获取未来的天气信息
]

const mapStyle = [
    'amap://styles/normal',
    'amap://styles/dark',
    'amap://styles/light',
    'amap://styles/whitesmoke',
    'amap://styles/fresh',
    'amap://styles/grey',
    'amap://styles/graffiti',
    'amap://styles/macaron',
    'amap://styles/blue',
    'amap://styles/darkblue',
    'amap://styles/wine',
]

export default {
    plugins,
    mapStyle
}