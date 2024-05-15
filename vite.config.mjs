import {
    defineConfig
} from 'vite';
import glsl from "vite-plugin-glsl";

export default defineConfig({
    build: {
        target: 'esnext',
        minify: false,
        sourcemap: true,
    },
    plugins: [glsl()],
});