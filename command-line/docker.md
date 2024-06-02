Docker 提供了一系列简洁而强大的命令行工具，使得与 Docker 容器和镜像的交互变得非常直观和方便。以下是一些基本的 Docker 命令及其用途：

1. **docker run**：这个命令用于从镜像创建并启动一个新的容器。你可以通过这个命令指定容器要运行的命令、工作目录、环境变量、端口映射等。

2. **docker pull**：用于从 Docker 仓库中拉取镜像到本地。例如，`docker pull ubuntu` 会下载 Ubuntu 的官方镜像。

3. **docker images**：列出本地所有的 Docker 镜像。

4. **docker ps**：列出正在运行的容器。使用 `-a` 参数可以查看所有容器（包括停止的）。

5. **docker stop**：停止一个运行中的容器，需要指定容器ID或名称。

6. **docker rm**：删除一个或多个容器。通常与 `-f`（强制删除）和 `docker ps -a -q`（获取所有容器ID）结合使用以删除所有停止的容器。

7. **docker rmi**：删除一个或多个镜像。

8. **docker build**：从 Dockerfile 构建一个新的镜像。例如，`docker build -t my-image .` 会在当前目录下查找 Dockerfile 并创建名为 `my-image` 的镜像。

除了命令行工具，Docker 还提供了一套 RESTful API，允许程序和脚本以编程方式与 Docker daemon 交互，执行与命令行相同的操作，甚至更多。这些 API 可以用于自动化容器和镜像的管理，集成 Docker 到持续集成/持续部署（CI/CD）流程中，或者开发自定义的管理界面。API 接口文档通常可以在 Docker 官方文档中找到，是进行 Docker 自动化管理和集成的重要资源。****