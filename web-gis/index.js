import CesiumUtils from './utils/cesium';
import * as Cesium from 'cesium';

// 创建工具类实例，假设HTML中有一个id为'cesiumContainer'的div
const cesiumUtils = new CesiumUtils({
  containerId: 'cesiumContainer'
});

setTimeout(() => {
  const position = Cesium.Cartesian3.fromDegrees(86.57, 27.7, 15000); // 指定一个位置
  const text = '珠穆朗玛峰'; // 标签文本
  // 添加标签到Cesium场景
  cesiumUtils.addLabel(position, text, {
    font: '20px sans-serif',
    fillColor: Cesium.Color.YELLOW,
    outlineColor: Cesium.Color.BLACK,
    outlineWidth: 2,
    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
    pixelOffset: new Cesium.Cartesian2(0, -20), // 向下和向右偏移
    horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
  });
  /************************************************************************* */

  // 在珠穆朗玛峰周围添加几个Billboard
  cesiumUtils.addBillboard(
    Cesium.Cartesian3.fromDegrees(83.9245, 27.9885), // 稍微偏西的位置
    'trailblazer 1', {
      scale: 0.1,
      image: './assets/images/rail-star/trailblazer-female.png'
    }
  );

  cesiumUtils.addBillboard(
    Cesium.Cartesian3.fromDegrees(89.9255, 27.9879), // 稍微偏东的位置
    'trailblazer 2', {
      scale: 0.05,
      image: './assets/images/rail-star/trailblazer-male.png'
    }
  );
  /************************************************************************* */

  // 创建一个多边形，需要提供具有不同坐标的顶点数组
  const polygonPositions = [
    Cesium.Cartesian3.fromDegrees(121.4737, 31.2304, 100), // 上海的一个点，高度为100
    Cesium.Cartesian3.fromDegrees(121.4737 + 10.001, 31.2304, 100), // 上海的另一个点，高度为100
    Cesium.Cartesian3.fromDegrees(121.4737, 31.2304 + 10.001, 100), // 上海的另一个点，高度为100
    // 添加更多顶点以形成多边形
  ];

  cesiumUtils.addPolygon(
    polygonPositions, // 顶点数组
    new Cesium.Color(1.0, 0.0, 0.0, 0.5), // 红色半透明材质
    // position 参数不需要，因为多边形的位置由 hierarchy 顶点定义
  );
  /************************************************************************* */

  // 汕头的经纬度坐标
  const shantouPosition = Cesium.Cartesian3.fromDegrees(116.7286, 23.3398);
  // 创建一个动态对象
  const positionProperty = new Cesium.CallbackProperty(() => {
    return shantouPosition; // 动态对象的位置属性
  }, false);

  cesiumUtils.addDynamicObject(
    positionProperty, {
      uri: './assets/model/gltf/taxi.gltf', // 模型的 URI
      minimumPixelSize: 64, // 模型在屏幕上显示的最小像素大小
      // 其他模型配置选项...
    }, {
      availability: new Cesium.TimeIntervalCollection() // 对象的可用时间区间集合
    }
  );
  /************************************************************************* */
  // 广州塔的坐标
  const guangzhouTowerPosition = Cesium.Cartesian3.fromDegrees(113.3225, 23.1291, 600);

  // 标记点的配置选项
  const options = {
    color: Cesium.Color.RED, // 标记点颜色为红色
    pixelSize: 20, // 标记点像素大小为20
    outlineColor: Cesium.Color.BLACK, // 标记点轮廓颜色为黑色
    outlineWidth: 3 // 标记点轮廓宽度为3
  };

  // 调用函数添加标记点
  cesiumUtils.addPointMarker(guangzhouTowerPosition, options);

  /************************************************************************* */
  // 立方体的配置选项
  const options2 = {
    id: "testBox",
    dimensions: new Cesium.Cartesian3(100000, 100000, 100000), // 立方体的尺寸为1米
    material: Cesium.Color.BLUE.withAlpha(0.5) // 立方体的材质为蓝色半透明
  };

  // 假设我们想要将立方体放置在北京故宫附近
  const position2 = Cesium.Cartesian3.fromDegrees(116.407396, 39.90403, 100); // 经纬度坐标

  // 调用函数添加立方体
  cesiumUtils.addBox(position2, options2);
  /************************************************************************* */
  // 假设井冈山的经纬度坐标
  const jinggangshanLongitude = 114.0;
  const jinggangshanLatitude = 26.5;

  // 定义走廊的边界点，这里我们使用井冈山的坐标作为起点和终点
  // 您可以根据需要添加更多的点来定义走廊的形状
  // 定义走廊的边界点，这里我们使用井冈山的坐标作为起点和终点
  const corridorPositions = [
    Cesium.Cartesian3.fromDegrees(jinggangshanLongitude, jinggangshanLatitude - 0.1, 0), // 起点
    Cesium.Cartesian3.fromDegrees(jinggangshanLongitude + 0.1, jinggangshanLatitude + 0.1, 0) // 终点
  ];

  // 调用 addCorridor 方法在井冈山添加一个走廊
  cesiumUtils.addCorridor(corridorPositions, {
    width: 500000, // 设置走廊的宽度，单位为米
    material: Cesium.Color.BLUE // 设置走廊的材质为蓝色
  });
  /************************************************************************* */

  // 假设不知道哪的经纬度坐标
  const whoKonwWhereLongitude = 101.1400; // 经度
  const whoKonwWhereLatitude = 29.6500; // 纬度

  // 定义圆柱体的中心位置，假设高度为0
  const position3 = Cesium.Cartesian3.fromDegrees(whoKonwWhereLongitude, whoKonwWhereLatitude, 0);

  // 调用 addCylinder 方法在不知道哪添加一个圆柱体
  cesiumUtils.addCylinder(position3, {
    length: 1000000, // 设置圆柱体的长度为1000米
    topRadius: 50000, // 设置顶部半径为500米
    bottomRadius: 50000, // 设置底部半径为500米
    material: Cesium.Color.BLUE // 设置圆柱体的材质为蓝色
  });
  /************************************************************************* */
  // cesiumUtils.showYellowRiver()
  /************************************************************************* */
}, 2000);