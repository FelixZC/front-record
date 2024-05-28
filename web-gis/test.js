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

setTimeout(async() => {
    const viewer = cesiumUtils.viewer
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

    // viewer.camera.setView({
    //     destination: Cesium.Cartesian3.fromDegrees(86.57, 27.7, 15000),
    // });

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
}, 2000);