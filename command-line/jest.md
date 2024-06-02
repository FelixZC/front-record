Jest 是一个流行的 JavaScript 测试框架，广泛用于React及其他前端和Node.js项目中。以下是 Jest 的一些基本命令，这些命令对于开始编写和运行测试非常有用：

1. **安装 Jest**
   通常，你通过 npm 或 yarn 将 Jest 安装为项目的开发依赖：
   ```bash
   npm install --save-dev jest
   ```
   或
   ```bash
   yarn add --dev jest
   ```

2. **初始化 Jest 配置**
   如果是初次使用，可以运行以下命令来生成一个基本的 Jest 配置文件（jest.config.js）：
   ```bash
   npx jest --init
   ```

3. **运行所有测试**
   运行项目中的所有测试用例：
   ```bash
   npm test
   ```
   或直接使用 `jest` 命令，如果你已经将其设置为 npm 脚本的一部分，否则需要全局安装 Jest 才能直接使用：
   ```bash
   jest
   ```

4. **运行特定测试文件或目录**
   可以指定具体的文件或目录来运行测试：
   ```bash
   jest path/to/test/file.test.js
   ```
   或
   ```bash
   jest tests/
   ```

5. **监视模式（Watch Mode）**
   在开发过程中，可以使用监视模式自动重跑测试：
   ```bash
   npm test -- --watch
   ```
   或
   ```bash
   jest --watch
   ```

6. **覆盖报告（Coverage Report）**
   生成测试覆盖率报告：
   ```bash
   npm test -- --coverage
   ```
   或
   ```bash
   jest --coverage
   ```

7. **只运行失败的测试**
   如果你想专注于解决失败的测试，可以使用：
   ```bash
   jest --onlyFailed
   ```

8. **并行运行测试**
   Jest 默认会并行运行所有测试，但你可以通过配置或命令行参数调整这一行为。

记住，具体的命令和选项可能会随着 Jest 版本的更新而有所变化，建议查阅 Jest 的官方文档来获取最新的信息。