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
  }

  /**
   * 初始化Cesium视图。
   */
  initViewer(initOptions = {}) {
    return new Promise(async (resolve) => {
      const terrainProvider = await Cesium.createWorldTerrainAsync();
      this.viewer = new Cesium.Viewer(this.containerId, {
        terrainProvider: terrainProvider,
        animation: false, // 是否显示动画控件
        baseLayerPicker: false, // 是否显示图层选择控件
        fullscreenButton: false, // 是否显示全屏按钮
        vrButton: true, // vr部件
        geocoder: true, // 位置搜索部件
        homeButton: true, // 是否显示Home按钮
        infoBox: false, // 是否显示点击要素之后显示的信息
        sceneModePicker: true, // 二三维切换部件
        timeline: false, // 是否显示时间线控件
        navigationHelpButton: true, // 是否显示帮助信息控件
        useDefaultRenderLoop: true, // 是否使用默认的渲染循环，false表示不使用
        selectionIndicator: false, // 是否显示选择指标，false表示不显示
        navigationInstructionsInitiallyVisible: false, // 是否初始时显示导航指示，false表示不显示
        allowTextureFilterAnisotropic: false, // 是否允许各向异性纹理过滤，false表示不允许
        contextOptions: {
          webgl: {
            alpha: false, // 是否启用透明度
            antialias: true, // 是否启用抗锯齿
            preserveDrawingBuffer: true, // 是否保留绘制缓冲区
            failIfMajorPerformanceCaveat: false, // 如果存在重大性能问题，是否失败
            depth: true, // 是否启用深度测试
            stencil: false, // 是否启用模板测试
          },
        },
        targetFrameRate: 60, // 目标帧率，设置为60
        resolutionScale: 0.1, // 分辨率缩放比例，设置为0.1
        orderIndependentTranslucency: true, // 是否启用透明度独立于排序，true表示启用
        imageryProvider: undefined, // 地图影像提供者，未定义
        automaticallyTrackDataSourceClocks: false, // 是否自动跟踪数据源时钟，false表示不跟踪
        dataSources: null, // 数据源，设置为null
        clock: null, // 时钟，设置为null
        terrainShadows: Cesium.ShadowMode.DISABLED, // 地形阴影模式，设置为DISABLED表示禁用
        ...initOptions,
      });

      this.setupCamera();
      this.setViewConfig()
      // 定位到中国区域
      this.flyToLocation(Cesium.Rectangle.fromDegrees(73, 3, 136, 54))
      resolve();
    });
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

  /**
   * 移动相机到指定的位置。
   * @param {Object} destination 目标位置的对象。该对象通常包含经纬度（或其它坐标系统）等信息，具体取决于 viewer 的实现。
   * @param {Object} options 可选参数对象，用于自定义相机飞行动画的行为。
   *        可以包含如飞行速度、过渡时间、视野角度等动画效果控制选项。
   * @returns 无返回值。
   */
  flyToLocation(destination, options = {}) {
    // 将提供的 destination 和 options 合并，然后执行相机的飞行动画
    this.viewer.camera.flyTo({
      destination: destination,
      ...options
      // 这里可以添加其它自定义的相机飞行动画参数
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

  /**
   * 显示指定河流的方法
   * @param {number} westLongitude 西经，指定河流的西部边界
   * @param {number} southLatitude 南纬，指定河流的南部边界
   * @param {number} eastLongitude 东经，指定河流的东部边界
   * @param {number} northLatitude 北纬，指定河流的北部边界
   * @param {Array} riverColor 河流颜色，一个包含RGB值的数组 [R, G, B]
   * @param {number} [height=0] 河流的高度，默认为0
   * @returns {Cesium.Cartesian3} 返回俯瞰中心位置的坐标
   */
  showRiver(westLongitude, southLatitude, eastLongitude, northLatitude, riverColor, height = 0) {
    // 创建河流的矩形边界
    const riverRectangle = Cesium.Rectangle.fromDegrees(
      westLongitude, southLatitude,
      eastLongitude, northLatitude
    );

    // 根据河流边界创建 RectangleGeometry
    const riverGeometry = new Cesium.RectangleGeometry({
      rectangle: riverRectangle,
      height: height,
      vertexFormat: Cesium.VertexFormat.DEFAULT,
    });

    // 创建河流的几何实例
    const riverGeometryInstance = new Cesium.GeometryInstance({
      geometry: riverGeometry,
    });

    // 配置河流的外观，使用水面材质
    const riverAppearance = new Cesium.EllipsoidSurfaceAppearance({
      material: new Cesium.Material({
        fabric: {
          type: 'Water',
          uniforms: {
            baseWaterColor: new Cesium.Color(riverColor[0] / 255, riverColor[1] / 255, riverColor[2] / 255, 1.0),
            normalMap: Cesium.buildModuleUrl('Assets/Textures/waterNormals.jpg'), // 使用水面法线贴图
            frequency: 1000.0, // 设置波纹频率
            animationSpeed: 0.025, // 设置波纹动画速度
            amplitude: 5.0, // 设置波纹振幅
            specularIntensity: 0.5 // 设置镜面反射强度
          }
        }
      })
    });

    // 创建表示河流的Primitive并将其添加到场景中
    const riverPrimitive = new Cesium.Primitive({
      geometryInstances: riverGeometryInstance,
      appearance: riverAppearance,
    });

    // 将河流Primitive添加到Cesium Viewer的场景中
    this.viewer.scene.primitives.add(riverPrimitive);

    // 计算并返回俯瞰中心位置的坐标
    const center = Cesium.Cartesian3.fromDegrees((westLongitude + eastLongitude) / 2, (southLatitude + northLatitude) / 2, height + 500);
    return center
  }

  /**
   * 异步加载并为3D瓦片集应用样式
   * @param {Object} viewer Cesium的viewer对象，用于加载和显示3D瓦片集
   * @param {string} url 3D瓦片集的URL地址
   * @returns {Cesium.Cesium3DTileset} 返回加载并设置样式的瓦片集对象
   */
  async loadAndStyle3DTileset(viewer, url) {
    // 从提供的URL异步加载3D瓦片集
    const tileset = await Cesium.Cesium3DTileset.fromUrl(url);

    // 将加载的瓦片集添加到viewer的场景中
    viewer.scene.primitives.add(tileset);

    // 设置瓦片集的样式，基于瓦片的高度使用不同的颜色进行着色
    tileset.style = new Cesium.Cesium3DTileStyle({
      color: {
        conditions: [
          ["${Height} >= 83", "color('purple')"],
          ["${Height} >= 80", "color('red')"],
          ["${Height} >= 70", "color('orange')"],
          ["${Height} >= 12", "color('yellow')"],
          ["${Height} >= 7", "color('lime')"],
          ["${Height} >= 1", "color('DARKORANGE')"],
          ["true", "color('blue')"],
        ],
      },
    });
    return tileset
  }

  /**
   * 引入i3S数据服务和地形服务至Cesium场景
   * @param {Cesium.Viewer} viewer Cesium观景器实例，用于加载和显示i3S数据和地形服务
   * @param {string} elevationUrl 可选，国内地形服务的URL
   * @param {string} i3sUrl 可选，国内i3S数据服务的URL
   * @returns {Promise<Cesium.Cartesian3>} 返回一个Promise，解析为调整后的视点位置（中心点）
   */
  async loadDomesticData(viewer, elevationUrl, i3sUrl) {
    try {
      // 加载国内地形数据服务作为高程数据提供者
      const domesticElevationProvider = await Cesium.ArcGISTiledElevationTerrainProvider.fromUrl(elevationUrl);

      // 配置i3S数据服务加载选项，集成地形服务
      const i3sOptions = {
        traceFetches: false, // 不追踪数据抓取过程
        geoidTiledTerrainProvider: domesticElevationProvider, // 应用国内地形服务
      };

      // 加载i3S数据服务
      const i3sDataProvider = await Cesium.I3SDataProvider.fromUrl(i3sUrl, i3sOptions);
      viewer.scene.primitives.add(i3sDataProvider);

      // 调整视角至i3S数据区域中心并提升高度
      const viewCenter = Cesium.Rectangle.center(i3sDataProvider.extent);
      viewCenter.height = 10000.0; // 视角高度设置为10000米
      const destination = Cesium.Ellipsoid.WGS84.cartographicToCartesian(viewCenter);
      return destination
    } catch (error) {
      console.error("加载数据时发生错误:", error);
    }
  }
}
export default CesiumUtils;