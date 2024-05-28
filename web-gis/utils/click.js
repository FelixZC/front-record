import * as Cesium from "cesium";
/**
 * 获取鼠标点击位置对应的三维坐标
 * @param {Cesium.Viewer} viewer - Cesium 地图的 Viewer 实例。
 * @param {Cesium.Cartesian2} position - 鼠标点击的位置（屏幕坐标）。
 * @return {Cesium.Cartesian3} - 鼠标点击位置对应的三维坐标。
 */
function getPosition(viewer, position) {
  let earthPosition;
  if (viewer.terrainProvider instanceof Cesium.EllipsoidTerrainProvider) {
    earthPosition = viewer.scene.camera.pickEllipsoid(position);
  } else {
    const ray = viewer.camera.getPickRay(position);
    earthPosition = viewer.scene.globe.pick(ray, viewer.scene);
  }
  return earthPosition;
}

/**
 * 将 Cesium.Color 对象转换为 CSS 颜色字符串
 * @param {Cesium.Color} cesiumColor - Cesium 颜色对象。
 * @return {string} - CSS 颜色字符串。
 */
function cesiumColorToCssColorString(cesiumColor) {
  const r = Math.round(cesiumColor.red * 255);
  const g = Math.round(cesiumColor.green * 255);
  const b = Math.round(cesiumColor.blue * 255);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

/**
 * 用于添加颜色选择功能的类。
 */
export class addColorPick {
  /**
   * 构造函数，初始化各种属性。
   * @param {Object} options 配置项，目前未使用。
   */
  constructor(options) {
    this.listener = undefined; // 用于监听渲染事件的函数
    this.handler = undefined; // 屏幕空间事件处理器
    this.colorPickerContainer = null; // 颜色选择器容器的DOM引用
    this.colorPicker = null; // 颜色选择器的DOM引用
    this.colorPickerEventListener = null; // 颜色选择器的事件监听器
    this.changeColorEntity = {
      primitive: undefined, // 当前被选中的图形对象
      originalColor: new Cesium.Color(), // 原始颜色
      newColor: new Cesium.Color(), // 新颜色
    };
  }

  /**
   * 创建颜色选择器UI组件。
   */
  createColorPicker() {
    this.colorPickerContainer = document.getElementById('colorPickerContainer');
    if (!this.colorPickerContainer) {
      console.error('Color picker container not found.');
      return;
    }
    const colorPicker = document.createElement('input');
    colorPicker.type = 'color';
    colorPicker.value = '#ffffff'; // 设置默认颜色为白色
    this.colorPickerContainer.appendChild(colorPicker);
    this.colorPicker = colorPicker;
    
    // 设置颜色选择器变化事件监听器
    this.colorPickerEventListener = (event) => {
      const userSelectedColor = Cesium.Color.fromCssColorString(event.target.value);
      this.applyNewColor(this.changeColorEntity.primitive, userSelectedColor);
      this.hideColorPicker(); // 颜色选择后隐藏选择器
    };
    colorPicker.addEventListener('change', this.colorPickerEventListener);
  }

  /**
   * 将颜色选择功能绑定到 viewer。
   * @param {Cesium.Viewer} viewer Cesium 视图对象。
   */
  bindAction(viewer) {
    this.createColorPicker(); // 如果不存在，则创建颜色选择器
    if (!this.handler) {
      this.handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    }
    this.handler.setInputAction((click) => {
      const pickedObject = viewer.scene.pick(click.position);
      if (Cesium.defined(pickedObject)) {
        // 当点击图元时，显示颜色选择器
        this.changeColorEntity.primitive = pickedObject;
        this.changeColorEntity.originalColor = Cesium.Color.clone(pickedObject.color);
        const earthPosition = getPosition(viewer, click.position);
        const screenPosition = Cesium.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene, earthPosition);
        this.colorPicker.value = cesiumColorToCssColorString(this.changeColorEntity.originalColor);
        this.colorPickerContainer.style.left = `${screenPosition.x}px`;
        this.colorPickerContainer.style.top = `${screenPosition.y}px`;
        this.colorPickerContainer.style.display = 'block';
      } else {
        this.hideColorPicker(); // 若未点击图元，则隐藏颜色选择器
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  }

  /**
   * 隐藏颜色选择器UI组件。
   */
  hideColorPicker() {
    this.colorPickerContainer.style.display = 'none';
  }

  /**
   * 应用新颜色到选定的图元。
   * @param {Object} primitive 图元对象。
   * @param {Cesium.Color} color 颜色。
   */
  applyNewColor(primitive, color) {
    // 如果颜色未改变或没有选定图元，则不进行操作
    if (!primitive || Cesium.Color.equals(color, this.changeColorEntity.newColor)) {
      return;
    }
    this.changeColorEntity.newColor = color;
    primitive.color = color;
  }

  /**
   * 解除颜色选择功能与 viewer 的绑定。
   * @param {Cesium.Viewer} viewer Cesium 视图对象。
   */
  unbindAction(viewer) {
    if (this.changeColorEntity.primitive) {
      // 清理选定的图元颜色，恢复原始颜色
      // this.applyNewColor(primitive, this.changeColorEntity.originalColor);
      this.changeColorEntity.primitive = undefined;
      this.changeColorEntity.originalColor = new Cesium.Color();
      this.changeColorEntity.newColor = new Cesium.Color();
    }
    if (this.handler) {
      this.handler.destroy();
      this.handler = null;
    }
    if (this.listener) {
      viewer.scene.postRender.removeEventListener(this.listener);
      this.listener = null;
    }
    if (this.colorPicker) {
      this.colorPicker.removeEventListener('change', this.colorPickerEventListener);
      this.colorPicker.remove();
      this.colorPickerEventListener = null; // 清除引用，以便垃圾回收
    }
  }
}
export class addHighLight {
  /**
   * 创建一个添加高亮显示功能的类实例。
   * @param {Object} options 初始化配置选项，当前版本未使用。
   */
  constructor(options) {
    this.listener = undefined; // 后渲染事件监听器
    this.handler = undefined; // 屏幕空间事件处理器
    this.highlighted = { // 用于存储当前被高亮显示的primitive对象及其原始颜色
      primitive: undefined,
      originalColor: new Cesium.Color(),
    }
  }

  /**
   * 绑定高亮显示功能到viewer上。
   * @param {Object} viewer Cesium的viewer对象，用于操作和交互的三维视图容器。
   */
  bindAction(viewer) {
    this.handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas); // 初始化屏幕空间事件处理器
    // 设置点击事件处理逻辑
    this.handler.setInputAction((click) => {
      // 获取点击位置的primitive对象
      const pickobject = viewer.scene.pick(click.position);
      // 如果存在被高亮的primitive，则恢复其原始颜色，并清除高亮状态
      if (this.highlighted.primitive) {
        this.highlighted.primitive.color = this.highlighted.originalColor;
        this.highlighted.primitive = undefined;
        this.highlighted.originalColor = undefined;
      }
      // 如果点击位置有primitive对象，则将其颜色更改为红色进行高亮显示
      if (Cesium.defined(pickobject)) {
        this.highlighted.primitive = pickobject;
        this.highlighted.originalColor = Cesium.Color.clone(pickobject.color);
        pickobject.color = Cesium.Color.RED;
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK); // 只响应左键点击
  }

  /**
   * 解除绑定的高亮显示功能。
   * @param {Object} viewer Cesium的viewer对象。
   */
  unbindAction(viewer) {
    // 如果存在被高亮的primitive，恢复其原始颜色，并重置状态
    if (this.highlighted.primitive) {
      this.highlighted.primitive.color = this.highlighted.originalColor;
      this.highlighted.primitive = undefined;
      this.highlighted.originalColor = new Cesium.Color();
    }
    // 如果存在屏幕空间事件处理器，销毁并重置
    if (this.handler) {
      this.handler.destroy();
      this.handler = null;
    }
    // 如果存在后渲染事件监听器，移除并重置
    if (this.listener) {
      viewer.scene.postRender.removeEventListener(this.listener);
      this.listener = null;
    }
  }
}


/**
 * ShowInfoWindow 类用于在地图上点击位置时显示信息窗口。
 * @param {string} infoDivId - 用于显示信息的HTML元素的ID，默认为'infoDiv'。
 */
export class ShowInfoWindow {
  constructor(infoDivId = 'infoDiv') {
    this.handler = null; // 屏幕空间事件处理器
    this.listener = null; // 场景后渲染事件监听器
    this.isVisible = false; // 信息窗口是否可见
    this.infoDiv = document.getElementById(infoDivId); // 获取用于显示信息的HTML元素
  }

  /**
   * 绑定信息窗口的动作到地图视图上。
   * @param {Cesium.Viewer} viewer - Cesium地图视图对象。
   */
  bindAction(viewer) {
    this.handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    // 当屏幕空间发生左键点击事件时的动作
    this.handler.setInputAction((click) => {
      // 如果已存在监听器，则执行监听器并重置
      if (this.listener) {
        this.listener();
        this.listener = null;
        this.isVisible = false;
        this.infoDiv.style.display = 'none'; // 隐藏信息窗口
      }

      // 获取点击位置的地球坐标
      const earthPosition = getPosition(viewer, click.position);
      if (earthPosition) {
        // 将地球坐标转换为经纬度高度，并格式化数值
        const position = viewer.scene.globe.ellipsoid.cartesianToCartographic(earthPosition);
        const lon = Cesium.Math.toDegrees(position.longitude).toFixed(6);
        const lat = Cesium.Math.toDegrees(position.latitude).toFixed(6);
        const height = position.height.toFixed(2);

        // 在信息窗口显示经纬度和高度信息
        this.infoDiv.innerHTML = `Longitude: ${lon}, Latitude: ${lat}, Height: ${height} meters`;
        this.isVisible = true;
        this.infoDiv.style.display = 'block'; // 显示信息窗口

        // 监听场景后渲染事件，以动态调整信息窗口的位置
        this.listener = viewer.scene.postRender.addEventListener(() => {
          const windowPosition = Cesium.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene, earthPosition);
          if (windowPosition) {
            // 根据地球坐标在屏幕上的位置，调整信息窗口的位置
            this.infoDiv.style.top = `${windowPosition.y}px`;
            this.infoDiv.style.left = `${windowPosition.x}px`;
          }
        });
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK); // 设定事件类型为左键点击
  }

  /**
   * 解除信息窗口的动作绑定。
   * @param {Cesium.Viewer} viewer - Cesium地图视图对象。
   */
  unbindAction(viewer) {
    // 如果存在事件处理器，销毁并重置
    if (this.handler) {
      this.handler.destroy();
      this.handler = null;
    }
    // 如果存在后渲染事件监听器，移除并重置
    if (this.listener) {
      viewer.scene.postRender.removeEventListener(this.listener);
      this.listener = null;
      this.isVisible = false;
      this.infoDiv.style.display = 'none'; // 隐藏信息窗口
    }
  }
}

/**
 * 定义一个用于在Cesium地图上绘制圆的类
 * 构造函数，初始化绘制圆所需的属性
 * @param {Object} options 配置项，目前未使用
 */

export class DrawCircle {
  constructor(options) {
    this.layer = new Cesium.CustomDataSource("MyCircles"); // 创建自定义数据源层
    this.center = undefined; // 圆的中心点坐标
    this.activePosition = undefined; // 鼠标激活时的位置
    this.activeShape = undefined; // 当前活动的形状（即正在绘制的圆）
    this.handler = undefined; // 处理屏幕空间事件的手柄
  }

  /**
   * 绑定鼠标操作来绘制圆
   * @param {Cesium.Viewer} viewer 目标Cesium视图对象
   */
  bindAction(viewer) {
    if (!this.handler) {
      this.handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas); // 创建屏幕空间事件处理器
    }
    // 鼠标左键点击事件：确定圆的中心点
    this.handler.setInputAction((click) => {
      const earthPosition = getPosition(viewer, click.position);
      if (Cesium.defined(earthPosition)) {
        if (!this.center) {
          this.center = earthPosition;
        }
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    // 鼠标移动事件：更新活动位置和绘制临时圆
    this.handler.setInputAction((move) => {
      if (this.center) {
        const earthPosition = getPosition(viewer, move.endPosition);
        if (Cesium.defined(earthPosition)) {
          this.activePosition = earthPosition;
          if (!this.activeShape) {
            // 动态计算圆的半径
            const radius = new Cesium.CallbackProperty(() => {
              return Cesium.Cartesian3.distance(this.center, this.activePosition);
            }, false);
            this.activeShape = this.drawCircle(this.center, radius); // 绘制临时圆
          }
        }
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    // 鼠标右键点击事件：结束绘制并添加圆到地图
    this.handler.setInputAction((click) => {
      if (this.activeShape) {
        const earthPosition = getPosition(viewer, click.position);
        if (Cesium.defined(earthPosition)) {
          const radius = Cesium.Cartesian3.distance(this.center, earthPosition);
          this.drawCircle(this.center, radius); // 绘制并添加最终的圆
          this.layer.entities.remove(this.activeShape); // 移除临时圆
          this.center = undefined; // 重置中心点
          this.activePosition = undefined; // 重置活动位置
          this.activeShape = undefined; // 重置活动形状
        }
      }
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
  }

  /**
   * 解绑鼠标操作
   * @param {Cesium.Viewer} viewer 目标Cesium视图对象
   */
  unbindAction(viewer) {
    if (this.handler) {
      this.handler.destroy(); // 销毁事件处理器
      this.handler = undefined;
    }
  }

  /**
   * 绘制圆
   * @param {Cesium.Cartesian3} center 圆的中心点坐标
   * @param {number|Cesium.CallbackProperty} radius 圆的半径，可以是固定数值或动态返回半径的回调函数
   * @return {Cesium.Entity} 绘制的圆的实体对象
   */
  drawCircle(center, radius) {
    return this.layer.entities.add({ // 添加圆到自定义数据源层
      position: center,
      ellipse: {
        semiMinorAxis: radius, // 半短轴，即半径
        semiMajorAxis: radius, // 半长轴，与半短轴相同，保持圆的形状
        material: Cesium.Color.RED.withAlpha(0.5), // 圆的材质颜色
      },
    });
  }

  /**
   * 将绘制圆的图层添加到地图
   * @param {Cesium.Viewer} viewer 目标Cesium视图对象
   */
  addToMap(viewer) {
    viewer.dataSources.add(this.layer); // 添加自定义数据源层到地图
  }
}

/**
 * 构造函数，初始化画线工具类
 * @param {object} options 配置项，暂未使用
 */
export class DrawLines {

  constructor(options) {
    this.layer = new Cesium.CustomDataSource("MyLines"); // 创建自定义数据源
    this.activeShapePoints = []; // 存储活动形状的点
    this.activeShape = undefined; // 存储当前活动的形状
    this.handler = undefined; // 屏幕空间事件处理器
  }

  /**
   * 绑定画线操作的鼠标事件
   * @param {Cesium.Viewer} viewer 目标地图的Viewer实例
   */
  bindAction(viewer) {
    if (!this.handler) {
      this.handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas); // 创建屏幕空间事件处理器
    }
    // 鼠标左键点击事件：添加点到活动形状点数组，并根据点数组画线
    this.handler.setInputAction((click) => {
      const earthPosition = getPosition(viewer, click.position);
      if (Cesium.defined(earthPosition)) {
        if (this.activeShapePoints.length === 0) {
          this.activeShapePoints.push(earthPosition);
          const dynamicPositions = new Cesium.CallbackProperty(() => {
            return this.activeShapePoints;
          }, false);
          this.activeShape = this.drawLine(dynamicPositions); // 创建动态线
        }
        this.activeShapePoints.push(earthPosition);
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    // 鼠标移动事件：更新最后一点的位置，实现线的动态拖拽
    this.handler.setInputAction((move) => {
      if (this.activeShapePoints.length >= 2) {
        const earthPosition = getPosition(viewer, move.endPosition);
        if (Cesium.defined(earthPosition)) {
          this.activeShapePoints.pop();
          this.activeShapePoints.push(earthPosition);
        }
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    // 鼠标右键点击事件：结束画线，将线添加到地图层
    this.handler.setInputAction((click) => {
      this.activeShapePoints.pop();
      this.drawLine(this.activeShapePoints);
      this.layer.entities.remove(this.activeShape); // 从数据源中移除之前的活动形状
      this.activeShapePoints = []; // 重置活动形状点数组
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
  }

  /**
   * 解绑画线操作的鼠标事件
   * @param {Cesium.Viewer} viewer 目标地图的Viewer实例
   */
  unbindAction(viewer) {
    if (this.handler) {
      this.handler.destroy(); // 销毁事件处理器
      this.handler = undefined;
    }
  }

  /**
   * 根据点数组画线
   * @param {array<Cesium.Cartesian3>} positionData 线的坐标点数组
   * @returns 添加的线实体
   */
  drawLine(positionData) {
    return this.layer.entities.add({ // 添加线到自定义数据源
      polyline: {
        positions: positionData,
        clampToGround: true, // 线贴地
        width: 3, // 线宽
      },
    });
  }

  /**
   * 将画线的数据源添加到地图
   * @param {Cesium.Viewer} viewer 目标地图的Viewer实例
   */
  addToMap(viewer) {
    viewer.dataSources.add(this.layer); // 添加自定义数据源到地图
  }
}

/**
 * DrawPoints 类用于在Cesium地图上绘制点
 * 构造函数
 * @param {Object} options 配置选项，当前未使用
 */
export class DrawPoints {

  constructor(options) {
    this.layer = new Cesium.CustomDataSource("MyPoints"); // 创建自定义数据源用于存放绘制的点
    this.handler = undefined; // 初始化鼠标事件处理器
  }

  /**
   * 绑定鼠标点击事件来添加点
   * @param {Cesium.Viewer} viewer 目标Cesium地图观众对象
   */
  bindAction(viewer) {
    // 如果handler未定义，则创建新的ScreenSpaceEventHandler
    if (!this.handler) {
      this.handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    }
    // 设置左键点击的处理动作
    this.handler.setInputAction((click) => {
      let earthPosition = undefined;
      // 根据地形提供者类型来获取点击位置
      if (viewer.terrainProvider instanceof Cesium.EllipsoidTerrainProvider) {
        // 如果是球面，则直接在椭球体上拾取位置
        earthPosition = viewer.scene.camera.pickEllipsoid(click.position);
      } else {
        // 如果是地形，则通过光线投射到地形表面来拾取位置
        const ray = viewer.camera.getPickRay(click.position);
        earthPosition = viewer.scene.globe.pick(ray, viewer.scene);
      }
      // 如果成功拾取位置，则创建并添加一个点到数据源
      if (Cesium.defined(earthPosition)) {
        const entity = this.createPoint(earthPosition);
        this.layer.entities.add(entity);
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  }

  /**
   * 解绑鼠标事件
   * @param {Cesium.Viewer} viewer 目标Cesium地图观众对象
   */
  unbindAction(viewer) {
    // 如果handler已定义，则销毁并重置handler
    if (this.handler) {
      this.handler.destroy();
      this.handler = undefined;
    }
  }

  /**
   * 创建一个点实体
   * @param {Cesium.Cartesian3} worldPosition 三维世界坐标
   * @return {Cesium.Entity} 创建的点实体
   */
  createPoint(worldPosition) {
    // 创建并配置点实体
    const point = new Cesium.Entity({
      position: worldPosition,
      point: {
        color: Cesium.Color.RED, // 设置点颜色为红色
        pixelSize: 5, // 设置点的像素大小
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND, // 点高度固定在地面
      },
    });
    return point;
  }

  /**
   * 将绘制的点图层添加到地图
   * @param {Cesium.Viewer} viewer 目标Cesium地图观众对象
   */
  addToMap(viewer) {
    viewer.dataSources.add(this.layer); // 将自定义数据源添加到地图
  }
}

/**
 * 构造函数，初始化画多边形的工具类
 * @param {Object} options 配置项，暂未使用
 */
export class DrawPolygons {

  constructor(options) {
    this.layer = new Cesium.CustomDataSource("MyLines"); // 创建自定义数据源
    this.activeShapePoints = []; // 存储活动形状的点
    this.activeShape = undefined; // 存储当前活动的形状
    this.handler = undefined; // 存储屏幕空间事件处理器
  }

  /**
   * 绑定鼠标操作来绘制多边形
   * @param {Cesium.Viewer} viewer 目标地图的Viewer实例
   */
  bindAction(viewer) {
    if (!this.handler) {
      this.handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas); // 创建屏幕空间事件处理器
    }
    // 鼠标左键点击事件：添加点到多边形
    this.handler.setInputAction((click) => {
      const earthPosition = getPosition(viewer, click.position); // 获取点击位置的地理坐标
      if (Cesium.defined(earthPosition)) {
        if (this.activeShapePoints.length === 0) {
          // 如果是第一个点，初始化多边形
          this.activeShapePoints.push(earthPosition);
          const dynamicPositions = new Cesium.CallbackProperty(() => {
            return new Cesium.PolygonHierarchy(this.activeShapePoints);
          }, false);
          this.activeShape = this.drawPolygon(dynamicPositions); // 绘制动态多边形
        }
        this.activeShapePoints.push(earthPosition); // 添加点到多边形路径
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    // 鼠标移动事件：更新多边形的最后一个点
    this.handler.setInputAction((move) => {
      if (this.activeShapePoints.length >= 2) {
        const earthPosition = getPosition(viewer, move.endPosition); // 获取鼠标移动结束位置的地理坐标
        if (Cesium.defined(earthPosition)) {
          this.activeShapePoints.pop(); // 移除最后一个点
          this.activeShapePoints.push(earthPosition); // 添加新的点
        }
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    // 鼠标右键点击事件：结束绘制多边形
    this.handler.setInputAction((click) => {
      this.activeShapePoints.pop(); // 移除最后一个点
      this.layer.entities.remove(this.activeShape); // 移除当前绘制的多边形
      this.drawPolygon(this.activeShapePoints); // 重新绘制多边形
      this.activeShapePoints = []; // 重置点数组
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
  }

  /**
   * 解绑鼠标操作
   * @param {Cesium.Viewer} viewer 目标地图的Viewer实例
   */
  unbindAction(viewer) {
    if (this.handler) {
      this.handler.destroy(); // 销毁屏幕空间事件处理器
      this.handler = undefined;
    }
  }

  /**
   * 绘制多边形
   * @param {array<Cesium.Cartesian3>} positionData 多边形边界的坐标数组
   * @returns 返回绘制的多边形实体
   */
  drawPolygon(positionData) {
    return this.layer.entities.add({ // 向数据源添加多边形实体
      polygon: {
        hierarchy: positionData, // 多边形的坐标 hierarchy
        material: new Cesium.ColorMaterialProperty(Cesium.Color.WHITE.withAlpha(0.7)), // 多边形材质
      },
    });
  }

  /**
   * 将绘制的多边形图层添加到地图
   * @param {Cesium.Viewer} viewer 目标地图的Viewer实例
   */
  addToMap(viewer) {
    viewer.dataSources.add(this.layer); // 将自定义数据源添加到Viewer
  }
}