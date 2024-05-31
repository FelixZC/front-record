import * as Cesium from 'cesium';
import CesiumUtils from './utils/cesium';
import {
    createPyramid
} from './utils/custom-entity'
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
    const tilesetUrl = './assets/cesium-3d-tiles/tilesets/tileset/tileset.json'
    await cesiumUtils.loadAndStyle3DTileset(tilesetUrl)
        .then((tileset) => {
            console.log('Tileset loaded and styled successfully!');
            viewer.flyTo(tileset)
        })
        .catch((error) => {
            console.error('An error occurred while loading the tileset:', error);
        });
    /************************************************************************************************************************************************** */
    const {
        pyramidCenter,
        pyramidPrimitive
    } = createPyramid({
        longitude: -75.609580,
        latitude: 40.042476,
        scale: 50,
    })
    viewer.scene.primitives.add(pyramidPrimitive)
    // cesiumUtils.flyToLocation(pyramidCenter)
    /************************************************************************************************************************************************** */
    // const elevationUrl = "https://tiles.arcgis.com/tiles/z2tnIkrLQ2BRzr6P/arcgis/rest/services/EGM2008/ImageServer"
    // const i3sUrl = "https://tiles.arcgis.com/tiles/z2tnIkrLQ2BRzr6P/arcgis/rest/services/SanFrancisco_3DObjects_1_7/SceneServer/layers/0"
    // const dataCenter = await cesiumUtils.loadDomesticData(elevationUrl, i3sUrl)
    // cesiumUtils.flyToLocation(dataCenter)
    /************************************************************************************************************************************************** */
    // // 假设台湾山谷的经纬度范围
    // const westLongitude = 120.927083; // 西经
    // const southLatitude = 23.485136; // 南纬
    // const eastLongitude = 121.030721; // 东经
    // const northLatitude = 23.841802; // 北纬
    // // 假设水体颜色，这里使用一个近似的颜色值
    // const riverColor = [100, 150, 200]; // RGB颜色值，假设为0-255
    // const riverCenter = cesiumUtils.showRiver(westLongitude, southLatitude, eastLongitude, northLatitude, riverColor, 864.38);
    // cesiumUtils.flyToLocation(riverCenter)
    /************************************************************************************************************************************************** */
})