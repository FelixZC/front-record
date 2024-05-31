import * as Cesium from 'cesium'
import CesiumUtils from "./utils/cesium";
const cesiumUtils = new CesiumUtils({
  containerId: 'cesiumContainer',
});
cesiumUtils.initViewer({
  shouldAnimate: true, //是否允许动画
  selectionIndicator: false,
  baseLayerPicker: false,
  fullscreenButton: false,
  geocoder: false,
  homeButton: false,
  infoBox: false,
  sceneModePicker: false,
  timeline: false,
  navigationHelpButton: false,
  navigationInstructionsInitiallyVisible: false,
  showRenderLoopErrors: false,
  shadows: false,
}).then(async () => {
  const viewer = cesiumUtils.viewer;
  //不申请访问请求域名受限
  const token = 'your token';
  // 服务域名
  const tdtUrl = 'https://t{s}.tianditu.gov.cn/';
  // 服务负载子域
  const subdomains = ['0', '1', '2', '3', '4', '5', '6', '7'];

  // 抗锯齿
  viewer.scene.fxaa = true;
  viewer.scene.postProcessStages.fxaa.enabled = false;
  // 水雾特效
  viewer.scene.globe.showGroundAtmosphere = true;
  // 设置最大俯仰角，[-90,0]区间内，默认为-30，单位弧度
  viewer.scene.screenSpaceCameraController.constrainedPitch = Cesium.Math.toRadians(-20);
  viewer.scene.screenSpaceCameraController.autoResetHeadingPitch = false;
  viewer.scene.screenSpaceCameraController.inertiaZoom = 0.5;
  viewer.scene.screenSpaceCameraController.minimumZoomDistance = 50;
  viewer.scene.screenSpaceCameraController.maximumZoomDistance = 20000000;
  viewer.scene.screenSpaceCameraController.zoomEventTypes = [
    Cesium.CameraEventType.RIGHT_DRAG,
    Cesium.CameraEventType.WHEEL,
    Cesium.CameraEventType.PINCH,
  ];
  viewer.scene.screenSpaceCameraController.tiltEventTypes = [
    Cesium.CameraEventType.MIDDLE_DRAG,
    Cesium.CameraEventType.PINCH,
    {
      eventType: Cesium.CameraEventType.LEFT_DRAG,
      modifier: Cesium.KeyboardEventModifier.CTRL,
    },
    {
      eventType: Cesium.CameraEventType.RIGHT_DRAG,
      modifier: Cesium.KeyboardEventModifier.CTRL,
    },
  ];
  // 取消默认的双击事件
  viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

  // 叠加影像服务
  const imgMap = new Cesium.UrlTemplateImageryProvider({
    url: tdtUrl + 'DataServer?T=img_w&x={x}&y={y}&l={z}&tk=' + token,
    subdomains: subdomains,
    tilingScheme: new Cesium.WebMercatorTilingScheme(),
    maximumLevel: 18
  });
  viewer.imageryLayers.addImageryProvider(imgMap);

  // 叠加国界服务
  const iboMap = new Cesium.UrlTemplateImageryProvider({
    url: tdtUrl + 'DataServer?T=ibo_w&x={x}&y={y}&l={z}&tk=' + token,
    subdomains: subdomains,
    tilingScheme: new Cesium.WebMercatorTilingScheme(),
    maximumLevel: 10
  });
  viewer.imageryLayers.addImageryProvider(iboMap);

  // 如果你想要配置地形提供者的选项，比如请求自定义的地形服务
  // 你可以在 createWorldTerrain 方法中传递一个选项对象
  const options = {
    requestWaterMask: true, // 是否请求水域遮罩
    requestVertexNormals: true // 是否请求顶点法线
  };

  // 使用选项创建地形提供者
  const terrainProviderWithOptions = await Cesium.createWorldTerrainAsync(options);

  // 设置带有自定义选项的地形提供者到 viewer
  viewer.terrainProvider = terrainProviderWithOptions;

  viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(103.84, 31.15, 17850000), // 目标位置的经度、纬度和高度
    orientation: {
      heading: Cesium.Math.toRadians(348.4202942851978), // 设置方向
      pitch: Cesium.Math.toRadians(-89.74026687972041), // 设置俯仰
      roll: Cesium.Math.toRadians(0) // 设置旋转
    },
    complete: function callback() {
      // 定位完成之后的回调函数，可以在此处添加自定义逻辑
    }
  });
})