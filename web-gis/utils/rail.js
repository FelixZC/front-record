import 'cesium/Build/Cesium/Widgets/widgets.css'
import CesiumUtils from '../utils/cesium';
import * as Cesium from 'cesium'
const road = require('../assets/data/road.json')


/**
 * 定义一个SpriteLineMaterialProperty类，用于创建和管理精灵线材质属性。
 */
class SpriteLineMaterialProperty {
    /**
     * 构造函数
     * @param {Object} options 初始化选项，包含speed和color属性。
     */
    constructor(options) {
        this._definitionChanged = new Cesium.Event(); // 定义属性变化事件
        this._speed = undefined // 初始化速度
        this._color = undefined // 初始化颜色
        this.speed = options.speed // 设置速度
        this.color = options.color // 设置颜色
    }

    /**
     * 判断材质属性是否为常量。
     * @returns {Boolean} 总是返回false，表示材质属性可变。
     */
    get isConstant() {
        return false;
    }

    /**
     * 获取定义变化事件。
     * @returns {Cesium.Event} 定义变化事件对象。
     */
    get definitionChanged() {
        return this._definitionChanged;
    }

    /**
     * 获取材质类型。
     * @param {Cesium.JulianDate} time 时间点，未使用。
     * @returns {String} 返回材质类型名称。
     */
    getType(time) {
        return Cesium.Material.SpriteLineMaterialType;
    }

    /**
     * 获取材质属性值。
     * @param {Cesium.JulianDate} time 时间点，可用于获取时间相关的属性值。
     * @param {Object} result 用于存放结果的对象，可复用以减少内存分配。
     * @returns {Object} 返回包含颜色和速度的对象。
     */
    getValue(time, result) {
        if (!Cesium.defined(result)) {
            result = {};
        }
        result.color = Cesium.Property.getValueOrDefault(this._color, time, Cesium.Color.RED, result.color);
        result.speed = Cesium.Property.getValueOrDefault(this._speed, time, 10, result.speed);
        return result;
    }

    /**
     * 比较当前对象与另一个对象是否相等。
     * @param {SpriteLineMaterialProperty} other 另一个材质属性对象。
     * @returns {Boolean} 如果颜色和速度属性相等，则返回true，否则返回false。
     */
    equals(other) {
        return (this === other ||
            (other instanceof SpriteLineMaterialProperty &&
                Cesium.Property.equals(this._color, other._color) &&
                Cesium.Property.equals(this._speed, other._speed)))
    }
}
Object.defineProperties(SpriteLineMaterialProperty.prototype, {
    speed: Cesium.createPropertyDescriptor('speed'),
    color: Cesium.createPropertyDescriptor('color')
})
Cesium.SpriteLineMaterialProperty = SpriteLineMaterialProperty
Cesium.Material.SpriteLineMaterialType = 'SpriteLineMaterialType';
Cesium.Material.SpriteLineMaterialSource = `
uniform vec4 color;  
  const float pi = 3.1415926;
  czm_material czm_getMaterial(czm_materialInput materialInput)
  {
    czm_material material = czm_getDefaultMaterial(materialInput);
    float time = fract( czm_frameNumber * speed / 1000.0);
    vec2 st = materialInput.st;
    material.diffuse = color.rgb;
    material.alpha = 1.0 - fract(st.s * 2.0 + time);
    return material;
  }`
// 注册材质到Cesium的材质缓存中
Cesium.Material._materialCache.addMaterial(Cesium.Material.SpriteLineMaterialType, {
    fabric: {
        type: Cesium.Material.SpriteLineMaterialType,
        uniforms: {
            color: new Cesium.Color(1.0, 1.0, 0.0, 1.0),
            speed: 5.0
        },
        source: Cesium.Material.SpriteLineMaterialSource
    },
    translucent: function (material) {
        return true; // 表示材质是半透明的
    }
})
const cesiumUtils = new CesiumUtils({
    containerId: 'cesiumContainer'
});
const viewer = cesiumUtils.viewer
cesiumUtils.initViewer().then(async () => {
    const darkImagertLayer = new Cesium.ImageryLayer(
        new Cesium.UrlTemplateImageryProvider({
            url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
            subdomains: ["a", "b", "c", "d"],
        })
    )
    cesiumUtils.addImageryProvider(darkImagertLayer)

    Cesium.GeoJsonDataSource.load(road).then(dataSource => {
        viewer.zoomTo(dataSource)
        viewer.dataSources.add(dataSource);
        var entities = dataSource.entities.values;
        for (let entity of entities) {
            entity.polyline.width = 1
            entity.polyline.material = new Cesium.SpriteLineMaterialProperty({
                color: Cesium.Color.AQUA,
                speed: 10.0
            })
        }
    });
})