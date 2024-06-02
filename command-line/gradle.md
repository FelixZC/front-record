看起来您可能是想询问关于 Gradle 的常用命令，Gradle 是一个基于 Groovy 或 Kotlin 的构建自动化系统，广泛用于Java项目中。下面是Gradle的一些常用命令：

1. **gradle tasks**  
   列出项目中可用的任务。

2. **gradle build**  
   编译项目、运行测试并打包。这是最常用的命令，相当于Maven的`mvn package`。

3. **gradle clean**  
   清理构建输出目录，类似于Maven的`mvn clean`。

4. **gradle compileJava**  
   编译Java源代码。

5. **gradle test**  
   运行项目中的测试。

6. **gradle check**  
   执行所有的检查任务，通常包括测试、验证等。

7. **gradle assemble**  
   创建构建工件，如JAR文件，但不运行测试。

8. **gradle jar**  
   仅创建JAR文件。

9. **gradle install**  
   构建项目并将构建的工件安装到本地仓库。

10. **gradle publish**  
    发布构建的工件到远程仓库，这通常需要额外的配置。

11. **gradle dependencies**  
    显示项目的依赖树。

12. **gradle wrapper --gradle-version {version}**  
    生成或更新Gradle Wrapper文件，用于指定Gradle的特定版本执行构建，无需用户本地安装Gradle。

13. **gradle idea**  
    生成IntelliJ IDEA的项目文件。

14. **gradle eclipse**  
    生成Eclipse的项目文件。

15. **gradle --stacktrace**  
    在遇到错误时显示完整的堆栈跟踪，有助于调试问题。

请根据您的具体需求选择合适的Gradle命令。如果需要执行特定任务或有自定义的Task，直接使用 `gradle <task-name>` 即可。