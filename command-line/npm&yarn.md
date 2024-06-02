在前端开发中，`npm` 和 `yarn` 是两个广泛使用的包管理和项目依赖管理工具。下面是它们的一些常用命令，这些命令对于日常的开发工作至关重要：

### npm 常用命令

1. **安装依赖**
   - `npm install`：安装项目所有依赖（根据 `package.json`）。
   - `npm install <package>`：安装单个包。
   - `npm install <package> --save`：安装并保存到 `dependencies`（生产环境）。
   - `npm install <package> --save-dev`：安装并保存到 `devDependencies`（开发环境）。

2. **卸载依赖**
   - `npm uninstall <package>`：卸载包。
   - `npm uninstall <package> --save`：卸载并从 `dependencies` 中移除。
   - `npm uninstall <package> --save-dev`：卸载并从 `devDependencies` 中移除。

3. **更新依赖**
   - `npm update`：更新所有依赖到最新版本（遵循 `package.json` 中的版本范围）。
   - `npm update <package>`：更新指定包。

4. **查看信息**
   - `npm list`：列出项目所有依赖。
   - `npm outdated`：查看哪些依赖包有新版本可更新。
   - `npm view <package> versions`：查看包的所有版本。

5. **脚本执行**
   - `npm run <script>`：执行 `package.json` 中定义的脚本。

6. **其他**
   - `npm init`：初始化项目，创建 `package.json` 文件。
   - `npm help <command>`：查看特定命令的帮助信息。
   - `npm version`：查看或更新项目的版本号。

### yarn 常用命令

1. **安装依赖**
   - `yarn` 或 `yarn install`：安装项目所有依赖。
   - `yarn add <package>`：安装单个包。
   - `yarn add <package> --dev`：安装到开发依赖。

2. **卸载依赖**
   - `yarn remove <package>`：卸载包。

3. **更新依赖**
   - `yarn upgrade <package>`：更新指定包。
   - `yarn upgrade-interactive`：交互式更新过时的依赖。

4. **查看信息**
   - `yarn list`：列出项目所有依赖。
   - `yarn outdated`：查看哪些依赖包有新版本可更新。

5. **脚本执行**
   - `yarn run <script>`：执行 `package.json` 中定义的脚本。

6. **初始化与配置**
   - `yarn init`：初始化项目，创建 `yarn.lock` 文件。
   - `yarn config`：管理配置设置。

7. **其他**
   - `yarn why <package>`：解释为什么安装了某个包。
   - `yarn cache clean`：清理缓存。

这两个工具在操作逻辑上有很多相似之处，但Yarn在性能、确定性构建（通过`yarn.lock`文件）以及某些命令的命名上提供了一些差异化的特性。选择使用哪个主要依据个人偏好和项目需求。