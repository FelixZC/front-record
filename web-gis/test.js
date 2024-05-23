import * as Cesium from "cesium";
import CesiumUtils from './utils/cesium';

import {
    ShowInfoWindow,
    DrawCircle,
    DrawLines,
    DrawPoints,
    DrawPolygons
} from './utils/click'

const cesiumUtils = new CesiumUtils({
    containerId: 'cesiumContainer'
});

setTimeout(() => {
    const viewer = cesiumUtils.viewer
    // 初始化所有绘图工具
    const drawTools = {
        default: null,
        mouse: new ShowInfoWindow(),
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

    viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(86.57, 27.7, 15000),
    });
}, 2000);