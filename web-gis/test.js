import * as Cesium from "cesium";
import CesiumUtils from './utils/cesium';
import {
    addHighLight,
    addColorPick,
    ShowInfoWindow,
    DrawCircle,
    DrawLines,
    DrawPoints,
    DrawPolygons
} from './utils/click'

const cesiumUtils = new CesiumUtils({
    containerId: 'cesiumContainer'
});
cesiumUtils.initViewer().then(async () => {
    const viewer = cesiumUtils.viewer
    /************************************************************************************************************************************************** */
    // 初始化所有绘图工具
    const drawTools = {
        default: null,
        highlight: new addHighLight(),
        mouse: new ShowInfoWindow(),
        customColor: new addColorPick(),
        circle: new DrawCircle(),
        lines: new DrawLines(),
        points: new DrawPoints(),
        polygons: new DrawPolygons(),
    };

    // 为下拉菜单添加事件监听器
    document.getElementById('toolSelect').addEventListener('change', function (event) {
        activateTool(event.target.value);
    });

    // 激活工具函数
    function activateTool(toolName) {
        if (drawTools.currentTool) {
            drawTools.currentTool.unbindAction(viewer);
        }

        const newTool = drawTools[toolName];
        if (newTool) {
            newTool.bindAction(viewer);
            newTool.addToMap && newTool.addToMap(viewer);
            drawTools.currentTool = newTool;
        }
    }
    /************************************************************************************************************************************************** */
    await Cesium.Cesium3DTileset.fromUrl('./assets/cesium-3d-tiles/tilesets/tileset/tileset.json').then(function (tileset) {
        viewer.scene.primitives.add(tileset)
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
        viewer.flyTo(tileset)
    })
    /************************************************************************************************************************************************** */
    const {
        Cartesian3,
        GeometryInstance,
        Primitive,
        BlendingState,
        GeometryAttributes,
        PrimitiveType,
        GeometryAttribute,
        Transforms,
        ComponentDatatype,
        Geometry,
        BoundingSphere,
        Appearance,
        Matrix4,
    } = Cesium;
    const vertices = new Float32Array([
        // 底部四边形
        -1.0, -1.0, 0.0, // v4
        1.0, -1.0, 0.0, // v0
        1.0, 1.0, 0.0, // v1
        -1.0, 1.0, 0.0, // v3
        // 顶部顶点
        0.0, 0.0, 2.0, // v5
    ]);

    // 合并底部颜色和顶部颜色
    const colors = new Float32Array([
        0.4, 0.4, 1.0, // 蓝色
        0.4, 1.0, 0.4, // 绿色
        1.0, 0.4, 0.4, // 红色
        1.0, 1.0, 0.4, // 黄色
        1.0, 1.0, 1.0 // 白色
    ]);
    /**
     * 创建一个 GeometryAttributes 实例，用于存储几何体的属性，如位置和颜色。
     * 此实例不包含任何方法，仅用于数据存储。
     *
     * @param {Object} options 包含属性名及其对应 GeometryAttribute 实例的对象。
     * @param {GeometryAttribute} options.position 位置属性，包含组件数据类型、每个属性的组件数量和值。
     * @param {GeometryAttribute} options.color 颜色属性，包含组件数据类型、每个属性的组件数量和值。
     * @returns {GeometryAttributes} 返回一个新的 GeometryAttributes 实例。
     */
    const attributes = new GeometryAttributes({
        // 定义位置属性，使用 3D 空间中的坐标。
        position: new GeometryAttribute({
            componentDatatype: ComponentDatatype.DOUBLE,
            componentsPerAttribute: 3,
            values: vertices,
        }),
        // 定义颜色属性，使用 RGB 颜色值。
        color: new GeometryAttribute({
            componentDatatype: ComponentDatatype.FLOAT,
            componentsPerAttribute: 3,
            values: colors,
        }),
    })
    const indices = new Uint16Array([
        // 底部两个三角形
        0, 1, 2, // v4-v0-v1
        2, 3, 0, // v1-v3-v4

        // 侧面四个三角形，连接顶部到底部
        1, 0, 4, // v0-v1-v5
        2, 1, 4, // v1-v2-v5
        3, 2, 4, // v2-v3-v5
        0, 3, 4, // v3-v4-v5
    ]);
    /**
     * 创建一个包围球和几何体对象。
     * 该包围球用于包围几何体，以便于渲染和碰撞检测。
     * 
     * @param {Object} attributes 几何体的属性，包含顶点等信息。
     * @param {Array} indices 几何体的索引，用于指定顶点的连接方式。
     * @returns {Object} 返回一个包含几何体信息的对象。
     */
    const boundingSphere = new BoundingSphere(
        new Cartesian3(0.0, 0.0, 0.0), // 中心点坐标
        2.0 // 半径
    )

    // 创建几何体对象，包含属性、索引、primitiveType和包围球信息
    const geometry = new Geometry({
        attributes: attributes,
        indices: indices,
        primitiveType: PrimitiveType.TRIANGLES, // 几何体的类型，这里为三角形
        boundingSphere: boundingSphere, // 包围球对象
    })

    /**
     * 计算模型矩阵
     * 该函数首先将给定的经度（-75.611722度）和纬度（39.54度）转换为东北向上的框架，
     * 然后对此框架进行平移（在Z轴上向上移动25个单位），
     * 最后对结果进行均匀缩放（缩放系数为25.0）。
     * 
     * @returns {Matrix4} 计算得到的模型矩阵
     */
    const modelMatrix = Matrix4.multiplyByUniformScale(
        Matrix4.multiplyByTranslation(
            // 将给定的地理位置转换为东北向上的固定帧
            Transforms.eastNorthUpToFixedFrame(
                Cartesian3.fromDegrees(-75.609580, 40.042476)
            ),
            // 对转换后的框架进行平移
            new Cartesian3(0.0, 0.0, 50.0),
            new Matrix4()
        ),
        50.0, // 对结果进行均匀缩放
        new Matrix4()
    )
    //多面体的实例
    const instance = new GeometryInstance({
        geometry: geometry,
        modelMatrix: modelMatrix,
    })

    function v_shader() {
        return `
          in vec3 position3DHigh;
          in vec3 position3DLow;
          in float batchId;
          in vec4 color;
          out vec4 v_color;
          void main() {
              vec4 position = czm_modelViewProjectionRelativeToEye *czm_computePosition();
              v_color = color;
              gl_Position = position;
          }`
    }

    function f_shader() {
        return `
          in vec4 v_color;
          void main() {
              vec4 color = czm_gammaCorrect(v_color);
              out_FragColor = color;
          }`
    }

    let appearance = new Appearance({
        translucent: false, // 设置不为半透明
        closed: true, // 初始状态为关闭
        renderState: {
            blending: BlendingState.PRE_MULTIPLIED_ALPHA_BLEND, // 启用预乘Alpha的混合模式
            depthTest: {
                enabled: true
            }, // 启用深度测试
            depthMask: true, // 允许写入深度缓冲区
        },
        fragmentShaderSource: f_shader(), // 片段着色器源代码
        vertexShaderSource: v_shader(), // 顶点着色器源代码
    })
    viewer.scene.primitives.add(
        new Primitive({
            geometryInstances: instance,
            appearance: appearance,
            asynchronous: false,
        })
    )
    /************************************************************************************************************************************************** */
})