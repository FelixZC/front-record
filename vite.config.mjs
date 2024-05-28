import {
    defineConfig
} from 'vite';
import glsl from "vite-plugin-glsl";
import cesium from 'vite-plugin-cesium'; // 引入插件

export default defineConfig({
    transpileDependencies: true,
    build: {
        target: 'esnext',
        minify: false,
        sourcemap: true,
    },
    plugins: [glsl(), cesium()],
});