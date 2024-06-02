Vite 是一个由 Vue.js 作者尤雨溪开发的现代前端构建工具，它提供了极快的开发服务器启动速度和更新速度。以下是 Vite 的一些常用命令：

1. **安装Vite**
   ```bash
   npm install vite --save-dev
   ```
   或
   ```bash
   yarn add vite --dev
   ```
   将Vite添加为项目的开发依赖。

2. **创建Vite项目**
   使用Vite CLI创建一个新的项目：
   ```bash
   npm create vite@latest my-vite-project
   ```
   或
   ```bash
   yarn create vite my-vite-project
   ```
   这将引导你选择模板并初始化项目。

3. **启动开发服务器**
   在项目根目录下运行：
   ```bash
   npm run dev
   ```
   或
   ```bash
   yarn dev
   ```
   这将启动一个热更新的开发服务器。

4. **构建生产版本**
   构建项目用于生产环境：
   ```bash
   npm run build
   ```
   或
   ```bash
   yarn build
   ```
   这将对项目进行优化并打包静态资源到`dist`目录。

5. **预览生产构建**
   在构建之后，可以使用此命令预览生产构建的效果：
   ```bash
   npm run preview
   ```
   或
   ```bash
   yarn preview
   ```
   这会在本地开启一个服务器来serve `dist`目录的内容。

6. **查看帮助**
   如果想查看Vite CLI的所有可用命令及其选项，可以运行：
   ```bash
   vite --help
   ```

请注意，具体的命令可能会根据Vite的版本更新而有所变化，建议参考Vite的官方文档获取最新信息。