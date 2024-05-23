// 引入Cesium核心库
import * as Cesium from 'cesium';

/**
 * CesiumUtils 是一个用于初始化和管理Cesium视图的工具类。
 * @param {object} options 初始化配置项，包括：
 *   - containerId: string，视图容器的ID。
 *   - cameraPosition: object，相机初始位置，默认为从经纬度(0,0)转换的Cartesian3坐标，高度为2000000。
 */
class CesiumUtils {
  constructor(options) {
    this.containerId = options.containerId;
    this.cameraPosition = options.cameraPosition || Cesium.Cartesian3.fromDegrees(86.57, 27.7, 15000);
    this.viewer = null;
    this.infoDiv = null; // 用于显示信息的div
    this.listener = null; // 用于存储事件监听器
    this.visiable = false; // 控制信息显示的变量
    this.initViewer()
  }

  /**
   * 初始化Cesium视图。
   */
  async initViewer() {
    const terrainProvider = await Cesium.createWorldTerrainAsync();
    this.viewer = new Cesium.Viewer(this.containerId, {
      terrainProvider: terrainProvider,
      animation: false, //是否显示动画控件
      baseLayerPicker: true, //是否显示图层选择控件
      fullscreenButton: true, //是否显示全屏按钮
      vrButton: true, // vr部件
      geocoder: true, // 位置搜索部件
      homeButton: true, //是否显示Home按钮
      infoBox: true, //是否显示点击要素之后显示的信息
      sceneModePicker: true, // 二三维切换部件
      timeline: false, //是否显示时间线控件
      navigationHelpButton: true, //是否显示帮助信息控件
    });

    this.setupCamera();
    this.setViewConfig()
    // 定位到中国区域
    this.flyToLocation(Cesium.Rectangle.fromDegrees(73, 3, 136, 54))
  }
  /**
   * 添加地形提供者到viewer。
   * @param {Object} terrainProvider 地形提供者的配置对象。
   */
  addTerrainProvider(terrainProvider) {
    if (!this.viewer) return;
    this.viewer.terrainProvider = new Cesium.CesiumTerrainProvider(terrainProvider);
  }

  /**
   * 添加影像提供者到viewer。
   * @param {Object} imageryProvider 影像提供者的配置对象。
   */
  addImageryProvider(imageryProvider) {
    if (!this.viewer) return;
    this.viewer.imageryLayers.addImageryProvider(imageryProvider);
  }

  /**
   * 为指定实体添加路径。
   * @param {Object} entity 需要添加路径的实体对象。
   * @param {Object} options 路径的配置选项，包括leadTime, trailTime, width, material, resolution。
   */
  addPath(entity, options = {}) {
    const path = new Cesium.PathGraphics({
      leadTime: options.leadTime || 0,
      trailTime: options.trailTime || 1000,
      width: options.width || 5,
      material: options.material || Cesium.Color.YELLOW,
      resolution: options.resolution || 100,
      ...options
    });
    entity.path = path;
    if (!this.viewer) return;
    this.addEntity(entity);
  }

  /**
   * 在指定位置添加一个点标记。
   * @param {Object} position 点的经纬度高度位置。
   * @param {Object} options 点标记的配置选项，包括color, pixelSize, outlineColor, outlineWidth。
   */
  addPointMarker(position, options = {}) {
    const pointEntity = new Cesium.Entity({
      position: position,
      point: new Cesium.PointGraphics({
        color: options.color || Cesium.Color.WHITE,
        pixelSize: options.pixelSize || 10,
        outlineColor: options.outlineColor || Cesium.Color.BLACK,
        outlineWidth: options.outlineWidth || 2,
      }),
    });
    if (!this.viewer) return;
    this.addEntity(pointEntity);
  }

  /**
   * 在指定位置添加一个立方体框。
   * @param {Object} position 立方体框的中心位置。
   * @param {Object} options 立方体框的配置选项，包括dimensions, material。
   */
  addBox(position, options = {}) {
    const boxEntity = new Cesium.Entity({
      position: position,
      box: new Cesium.BoxGraphics({
        dimensions: options.dimensions || new Cesium.Cartesian3(1, 1, 1),
        material: options.material || Cesium.Color.BLUE.withAlpha(0.5),
      }),
    });
    if (!this.viewer) return;
    this.addEntity(boxEntity);
  }

  /**
   * 在一系列位置上添加一个走廊形状的标记。
   * @param {Array} positions 走廊的顶点位置数组。
   * @param {Object} options 走廊的配置选项，包括width, material。
   */
  // 定义 addCorridor 方法
  addCorridor(positions, options = {}) {
    const corridorEntity = new Cesium.Entity({
      corridor: new Cesium.CorridorGraphics({
        positions: positions,
        width: options.width || 100000, // 默认宽度为100000米
        material: options.material || Cesium.Color.YELLOW, // 默认材质为黄色
        cornerType: 'ROUNDED' // 可选，设置走廊角落的类型
      }),
    });
    // 使用 Cesium Viewer 实例添加实体
    this.addEntity(corridorEntity);
  }
  /**
   * 在当前视图中添加一个圆柱体。
   * @param {Cesium.Cartesian3} position - 圆柱体的地理位置。
   * @param {Object} options - 自定义圆柱体属性的选项对象，包括长度、上底半径、下底半径和材质。
   * @returns 无返回值。
   */

  addCylinder(position, options = {}) {
    // 创建一个圆柱体实体并设置其位置和图形属性
    const cylinderEntity = new Cesium.Entity({
      position: position,
      cylinder: new Cesium.CylinderGraphics({
        length: options.length || 500000,
        topRadius: options.topRadius || 200000,
        bottomRadius: options.bottomRadius || 200000,
        material: options.material || Cesium.Color.RED,
      }),
    });
    // 如果没有viewer实例，则不执行添加操作
    if (!this.viewer) return;
    // 将圆柱体实体添加到场景的几何体中
    this.addEntity(cylinderEntity);
  }

  setViewConfig() {
    // 检查浏览器是否支持图像渲染像素化处理，并相应地设置视图的分辨率比例
    if (Cesium.FeatureDetection.supportsImageRenderingPixelated()) {
      this.viewer.resolutionScale = window.devicePixelRatio;
    }
    // 启用FXAA抗锯齿和帧率显示
    this.viewer.scene.postProcessStages.fxaa.enabled = true;
    this.viewer.scene.debugShowFramesPerSecond = true;
    this.viewer.scene.globe.depthTestAgainstTerrain = true;
    this.viewer.scene.skyAtmosphere.show = true;
    // this.setFogSettings(true, {
    //   density: 0.025,
    //   minimumBrightness: 0.7
    // })
  }

  /**
   * 设置雾化设置。
   * @param {Boolean} fogEnabled 是否启用雾化。
   * @param {Object} options 配置项对象，包含雾化密度和最小亮度。
   */
  setFogSettings(fogEnabled, options) {
    // 启用或禁用雾化效果，并设置密度和最小亮度
    this.viewer.scene.fog.enabled = fogEnabled;
    this.viewer.scene.fog.density = 0.0025;
    this.viewer.scene.fog.minimumBrightness = options.minimumBrightness || 0.5;
  }

  /**
   * 设置相机初始视图。
   */
  setupCamera() {
    this.viewer.camera.setView({
      destination: this.cameraPosition,
    });
  }

  flyToLocation(destination) {
    // 移动相机到指定位置
    this.viewer.camera.flyTo({
      destination: destination,
      // 其他相机飞行动画参数
    });
  }

  /**
   * 合并添加实体和添加矩形的函数。
   * @param {object} entity 要添加的实体。
   */
  addEntity(entity) {
    this.viewer.entities.add(entity);
  }

  // 根据id查找场景中的Entity
  findEntityById(id) {
    return this.viewer.entities.getById(id)
  }

  /**
   * 合并移除实体和清空所有实体的函数。
   */
  clearEntities() {
    this.viewer.entities.removeAll()
  }

  /**
   * 更新实体
   * @param {object} entity 要更新的实体。
   * @param {object} properties 要更新的属性。
   */
  updateEntity(entity, properties) {
    if (properties.position) {
      entity.position = properties.position;
    }
    // 其他属性更新...
  }

  /**
   * 添加多边形。
   * @param {object} polygon 多边形的配置。
   */
  addPolygon(positions, material, options = {}) {
    const polygonEntity = new Cesium.Entity({
      polygon: new Cesium.PolygonGraphics({
        hierarchy: positions, // 多边形顶点数组
        material: material, // 多边形材质
        outline: true, // 是否显示轮廓线
        // 其他属性...
      }),
      position: options.position, // 多边形中心点位置
    });

    this.addEntity(polygonEntity);

  }

  /**
   * 添加动态对象。
   * @param {object} positionProperty 动态对象的位置属性。
   * @param {object} modelOptions 模型的配置选项。
   * @param {object} options 其他配置选项。
   */
  addDynamicObject(positionProperty, modelOptions, options = {}) {
    const dynamicObjectEntity = new Cesium.Entity({
      position: positionProperty, // 动态对象的位置
      model: new Cesium.ModelGraphics(modelOptions), // 模型配置
      // 其他属性...
    });

    this.addEntity(dynamicObjectEntity);

  }

  /**
   * 添加标签。
   * @param {object} position 标签的位置。
   * @param {string} text 标签的文本。
   * @param {object} options 其他配置选项。
   */
  /**
   * 添加标签到Cesium场景中。
   * @param {Cesium.Cartesian3} position 标签在场景中的全球坐标位置。
   * @param {string} text 标签显示的文本。
   * @param {Object} options 标签的附加选项，比如字体大小、颜色等。
   */
  addLabel(position, text, options = {}) {
    // 创建一个新的Entity对象，包含LabelGraphics用于显示文本
    const labelEntity = new Cesium.Entity({
      label: new Cesium.LabelGraphics({
        text: text, // 设置标签的文本
        // 以下属性可以根据需要设置
        font: options.font || '14px sans-serif', // 设置字体
        fillColor: options.fillColor || Cesium.Color.WHITE, // 设置文本颜色
        outlineColor: options.outlineColor || Cesium.Color.BLACK, // 设置文本轮廓颜色
        outlineWidth: options.outlineWidth || 1, // 设置轮廓宽度
        style: options.style || Cesium.LabelStyle.FILL, // 设置文本样式
        pixelOffset: options.pixelOffset || new Cesium.Cartesian2(0, 0), // 设置像素偏移量
        eyeOffset: options.eyeOffset || new Cesium.Cartesian3(0, 0, 0), // 设置视角偏移量
        horizontalOrigin: options.horizontalOrigin || Cesium.HorizontalOrigin.LEFT, // 设置水平对齐方式
        verticalOrigin: options.verticalOrigin || Cesium.VerticalOrigin.BOTTOM, // 设置垂直对齐方式
        // 更多属性...
      }),
      position: position, // 设置标签的全球坐标位置
    });

    // 将标签实体添加到场景中
    this.addEntity(labelEntity);
  }

  /**
   * 添加一个带有Billboard的Entity到场景中。
   * @param {Cesium.Cartesian3} position 标签在场景中的全球坐标位置。
   * @param {string} text 标签显示的文本。
   * @param {Object} options BillboardGraphics的附加选项。
   */
  addBillboard(position, text, options = {}) {
    // 创建一个新的Entity对象，包含BillboardGraphics用于显示图标或简单文本
    const billboardEntity = new Cesium.Entity({
      billboard: new Cesium.BillboardGraphics({
        text: text || 'welcome',
        image: options.image || './assets/images/texture/ie-tomb.jpg', // 图标路径或内置标识符
        show: true, // 是否显示
        verticalOrigin: options.verticalOrigin || Cesium.VerticalOrigin.BOTTOM, // 垂直原点
        horizontalOrigin: options.horizontalOrigin || Cesium.HorizontalOrigin.CENTER, // 水平原点
        scale: options.scale || 1, // 缩放比例
        color: options.color || Cesium.Color.WHITE, // 颜色
        // 更多属性...
      }),
      position: position, // 设置标签的全球坐标位置
    });

    // 将Billboard实体添加到场景中
    this.addEntity(billboardEntity);
  }

  /**
   * 获取地形高度。
   * @param {number} latitude 经度。
   * @param {number} longitude 纬度。
   * @returns {number} 地形高度。
   */
  getTerrainHeight(latitude, longitude) {
    return this.viewer.scene.globe.getHeight(Cesium.Cartesian3.fromDegrees(longitude, latitude));
  }

  /**
   * 聚焦到实体。
   * @param {object} entity 要聚焦的实体。
   * @param {object} options 聚焦选项。
   */
  zoomTo(entity, options = {}) {
    const boundingSphere = entity.computeBoundingSphere();
    this.viewer.camera.viewBoundingSphere(boundingSphere, options);
  }

  /**
   * 销毁Cesium视图。
   */
  destroyViewer() {
    if (this.viewer) {
      this.viewer.destroy();
      this.viewer = null;
    }
  }

  showYellowRiver() {
    // 假设黄河的经纬度范围
    const yellowRiverRectangle = Cesium.Rectangle.fromDegrees(
      103.5, 35.0, // 西经和南纬（黄河源头附近的坐标）
      111.0, 40.0 // 东经和北纬（黄河接近入海口的坐标）
    );

    // 创建一个表示黄河的 RectangleGeometry
    const yellowRiverGeometry = new Cesium.RectangleGeometry({
      rectangle: yellowRiverRectangle,
      height: 1000, // 假设的高度值，黄河的河床高度可以根据实际情况调整
      vertexFormat: Cesium.VertexFormat.DEFAULT,
    });

    // 创建一个 GeometryInstance 来包含黄河的几何体
    const yellowRiverGeometryInstance = new Cesium.GeometryInstance({
      geometry: yellowRiverGeometry,
    });

    // 创建一个 Primitive 来在场景中渲染黄河
    const yellowRiverPrimitive = new Cesium.Primitive({
      geometryInstances: yellowRiverGeometryInstance,
      appearance: new Cesium.EllipsoidSurfaceAppearance({
        material: new Cesium.Material({
          fabric: {
            type: "Water",
            uniforms: {
              baseWaterColor: new Cesium.Color(0.0, 0.5, 0.7, 1.0), // 黄河水的颜色，这里假设为蓝色
              normalMap: Cesium.buildModuleUrl("Assets/Textures/waterNormals.jpg"), // 水面法线贴图
              frequency: 1000.0, // 波纹频率
              animationSpeed: 0.025, // 波纹动画速度
              amplitude: 5.0, // 波纹振幅
              specularIntensity: 0.5 // 镜面反射强度
            }
          }
        })
      }),
    });

    // 将黄河添加到 Cesium Viewer 的场景中
    this.viewer.scene.primitives.add(yellowRiverPrimitive);
    const center = Cesium.Cartesian3.fromDegrees(103.5, 35.0, 1000);
    this.flyToLocation(center)
  }

}
export default CesiumUtils;