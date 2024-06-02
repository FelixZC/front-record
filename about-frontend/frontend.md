# 前端知识体系总结·改（by pzc 2021.08.22）

[[toc]]

<img src="/frontend.svg" width="100%" height='100%'>

## ES6 语法

### const 和 let

- 块级作用域的限定
- 常量的定义
- 闭包

  - 函数柯里化
  - 立即调用函数表达式 IIFE
  - 私有变量

### 字符串的扩展

- Unicode 扩展
- 模板字面量

  - 字符串插值
  - 模板字面量标签函数

### 对象的解构

- 解构破坏响应数据（变量引用变更）

### 正则表达式

- RegExp 构造函数

  - 正则表达式的修饰符的使用 i/g/m/s

- RegExp 对象方法

  - compile 编译正则表达式
  - exec 检索字符串中指定的值。返回找到的值，并确定其位置
  - test 检索字符串中指定的值。返回 true 或 false

- String 对象方法

  - search 检索与正则表达式相匹配的值
  - match 找到一个或多个正则表达式的匹配
  - replace 替换与正则表达式匹配的子串

    - $1、$2、...、$99 与 regexp 中的第 1 到第 99 个子表达式相匹配的文本。
    - $& 与 regexp 相匹配的子串。
    - $` 位于匹配子串左侧的文本。
    - $' 位于匹配子串右侧的文本。
    - $$ 直接量符号。

  - split 把字符串分割为字符串数组

- 分组捕获

  - group 分组捕获命名

### 数值扩展

- 进制表示变更
- 位运算符
- Math 与 Date 变更
- Number 的扩展
- BigInt 函数

### 函数扩展

- 箭头函数
- 参数默认值
- ...rest 剩余参数展开
- 函数名称 name
- 尾调用优化

### 数组的扩展

- 实例方法

  - push

    - 向数组的末尾添加一个或更多元素，并返回新的长度。

  - pop

    - 删除并返回数组的最后一个元素

  - unshift

    - 向数组的开头添加一个或更多元素，并返回新的长度。

  - shift

    - 删除并返回数组的第一个元素

  - splice

    - 删除元素，并向数组添加新元素。

  - slice

    - 从某个已有的数组返回选定的元素

  - map

    - 子项转化

  - some

    - 包含查找

  - filter

    - 过滤

  - forEach

    - 不等于 for 遍历

  - find/findIndex

    - 子项查找

  - join

    - 字符串转化

  - reverse

    - 数组反转

  - fill 数组填充
  - includes 包含数值比较判断

- 原型（静态）方法

  - Array.from
  - Array.of
  - Array.isArray

- 定型数组

  - ArrayBuffer（预分配内存，所有定型数组及视图引用的基本单位）

    - ElementType

  - 字节序

    - 大端字节序和小端字节序

  - DataView（读写 ArrayBuffer 的视图）

### 对象的扩展

- ...扩展运算符
- 原型（静态）方法

  - Object.assign

    - 通过复制一个或多个对象来创建一个新的对象。

  - Object.create

    - 使用指定的原型对象和属性创建一个新对象。

  - Object.defineProperty

    - 给对象添加一个属性并指定该属性的配置。

  - Object.defineProperties

    - 给对象添加多个属性并分别指定它们的配置。

  - Object.entries

    - 返回给定对象自身可枚举属性的 [key, value] 数组。

  - Object.freeze

    - 冻结对象：其他代码不能删除或更改任何属性。

  - Object.getOwnPropertyDescriptor

    - 返回对象指定的属性配置。

  - Object.getOwnPropertyNames

    - 返回一个数组，它包含了指定对象所有的可枚举或不可枚举的属性名。

  - Object.keys

    - 返回一个包含所有给定对象自身可枚举属性名称的数组。

  - Object.values

    - 返回给定对象自身可枚举值的数组。

- 属性描述符

  - 数据描述符

    - configurable
    - enumerable
    - value
    - writable

  - 存取描述符

    - configurable
    - enumerable
    - get
    - set

- 属性名省略

### 运算符扩展

### Symbol

- 常用内置符号引用

  - Symbol.iterator 等

- reflect-metadata 元数据的使用

### Map 与 WeakMap

### Set 与 WeakSet

### Proxy 代理

- 提供对象属性拦截操作，双向绑定和数据监测的原理
- 代理模式的使用

### Reflect 反射

- 与代理配对，解决 this 指向问题

### Generator 生成器

- 星号 与 yield 的使用
- next 与 done

### Iterator 迭代器

- for...in
- for...of
- for...await of
- 克隆示例

### 异步编程

- Promise 期约

  - resolve
  - reject
  - all
  - race

- 异步函数

  - async 与 await

### class 类

- 原型与构造器
- 接口
- 继承

  - 原型链继承的简化（语法糖）
  - super

- 静态方法与静态属性
- get/set

### module 模块化

- AMD（Asynchronous Module Definition）
- commonJS
- ES6 模块 type="module"

### decorator 装饰器

### 工作者线程

- 专用工作者线程
- 共享工作者线程
- 服务工作者线程

## BOM

### window 对象

- Global 作用域(window 对象)
- 窗口关系

  - window.parent、window.top 和 window.self

- 窗口位置与像素比

  - screenLeft 和 screenTop
  - window.devicePixelRatio

- 窗口大小

  - innerWidth、innerHeight、outerWidth 和 outerHeight
  - clientWidth 和 clientHeight

- 视口位置

  - scroll

- 导航与打开新窗口

  - window.open

- 定时器

  - setTimeout
  - setInterval

- 系统对话框

  - alert、confirm 和 prompt

### location 对象

- 查询字符串

  - location.search
  - URLSearchParams

- 操作地址

  - location.href

    - hash、search、hostname、pathname 和 port

  - location.reload
  - assign

### navigator 对象

- 检测插件

  - window.navigator.plugins

- 注册处理程序

  - navigator.registerProtocolHandler

- 客户端检测
- 用户代理检测
- 软件与硬件检测

### screen 对象

### history 对象

- go

  - back 和 forward

## DOM

### 节点层级

- Node 类型

  - Node.ELEMENT_NODE（1）
  - Node.ATTRIBUTE_NODE（2）
  - Node.TEXT_NODE（3）
  - Node.CDATA_SECTION_NODE（4）
  - Node.ENTITY_REFERENCE_NODE（5）
  - Node.ENTITY_NODE（6）
  - Node.PROCESSING_INSTRUCTION_NODE（7）
  - Node.COMMENT_NODE（8）
  - Node.DOCUMENT_NODE（9）
  - Node.DOCUMENT_TYPE_NODE（10）
  - Node.DOCUMENT_FRAGMENT_NODE（11）
  - Node.NOTATION_NODE（12）

- Document 类型
- Element 类型
- Text 类型
- Comment 类型
- CDATASection 类型
- DocumentType 类型
- DocumentFragment 类型
- Attr 类型

### MutationObserver 接口

- 异步回调与记录队列
- 性能、内存与垃圾回收

### 扩展

- Selectors API

  - querySelector
  - querySelectorAll
  - matches

- 元素遍历

  - childElementCount
  - firstElementChild
  - lastElementChild
  - previousElementSibling
  - nextElementSibling

- HTML5

  - getElementsByClassName

    - classList

      - add(value)，向类名列表中添加指定的字符串值 value。如果这个值已经存在，则什么也不做。
      - contains(value)，返回布尔值，表示给定的 value 是否存在。
      - remove(value)，从类名列表中删除指定的字符串值 value。
      - toggle(value)，如果类名列表中已经存在指定的 value，则删除；如果不存在，则添加。

  - 焦点管理

    - focus

  - HTMLDocument 扩展

    - readyState
    - compatMode
    - head

  - 自定义数据属性

    - 前缀 data-

  - 插入标记

    - innerHTML
    - outerHTML
    - insertAdjacentHTML
    - insertAdjacentText

  - 视野滚动 scrollIntoView
  - 专有扩展

    - children
    - contains
    - innerText
    - outerText

### 样式、遍历与范围

- 样式

  - 存取元素样式

    - getComputedStyle
    - CSSStyleSheet

  - 元素尺寸

    - 偏移尺寸

      - offsetHeight，元素在垂直方向上占用的像素尺寸，包括它的高度、水平滚动条高度（如果可见）和上、下边框的高度。
      - offsetLeft，元素左边框外侧距离包含元素左边框内侧的像素数。
      - offsetTop，元素上边框外侧距离包含元素上边框内侧的像素数。
      - offsetWidth，元素在水平方向上占用的像素尺寸，包括它的宽度、垂直滚动条宽度（如果可见）和左、右边框的宽度。

    - 客户端尺寸

      - clientWidth 内容区宽度加左、右内边距宽度
      - clientHeight 内容区高度加上、下内边距高度

    - 滚动尺寸

      - scrollHeight，没有滚动条出现时，元素内容的总高度。
      - scrollLeft，内容区左侧隐藏的像素数，设置这个属性可以改变元素的滚动位置。
      - scrollTop，内容区顶部隐藏的像素数，设置这个属性可以改变元素的滚动位置。
      - scrollWidth，没有滚动条出现时，元素内容的总宽度

- 遍历

  - NodeIterator 和 TreeWalker

- 范围

### XML

### 事件

- 用户界面事件
- 焦点事件
- 鼠标和滚轮事件
- 键盘与输入事件
- 合成事件
- 变化事件
- HTML5 事件
- 设备事件
- 触摸及手势事件

### 内存与性能优化

- 事件委托
- 删除事件处理程序

## JavaScript API

### Atomics 与 SharedArrayBuffer

- 算术及位操作方法

  - Atomics.add
  - Atomics.sub
  - Atomics.or
  - Atomics.and
  - Atomics.xor

- 原子读和写

  - Atomics.load 和 Atomics.store

- 原子交换

  - exchange 和 compareExchange

- 原子 Futex 操作与加锁

  - Atomics.wait 和 Atomics.notify

### 跨上下文消息

- postMessage 方法与 message 事件
- MessageChannel 和 BroadcastChannel

### Encoding API

- 文本编码

  - TextEncoder

    - encode
    - encodeInto

  - TextEncoderStream

    - pipeThrough

- 文本解码

  - TextDecoder

    - decode

  - TextDecoderStream

    - pipeThrough

### File API 与 Blob API

- FileReader

  - 方法

    - readAsText(file, encoding)：从文件中读取纯文本内容并保存在 result 属性中。第二个参数表示编码，是可选的
    - readAsDataURL(file)：读取文件并将内容的数据 URI 保存在 result 属性中。
    - readAsBinaryString(file)：读取文件并将每个字符的二进制数据保存在 result 属性中。
    - readAsArrayBuffer(file)：读取文件并将文件内容以 ArrayBuffer 形式保存在 result 属性。

  - 事件

    - progress、error 和 load

- FileReaderSync
- Blob 与部分读取

  - slice

- 对象 URL 与 Blob

  - window.URL.createObjectURL

### Notifications API

- 通知权限
- 显示和隐藏通知
- 通知生命周期回调

  - onshow 在通知显示时触发；
  - onclick 在通知被点击时触发；
  - onclose 在通知消失或通过 close 关闭时触发；
  - onerror 在发生错误阻止通知显示时触发。

### Page Visibility API

- document.visibilityState

  - 页面在后台标签页或浏览器中最小化了。
  - 页面在前台标签页中。
  - 实际页面隐藏了，但对页面的预览是可见的（例如在 Windows 7 上，用户鼠标移到任务栏图标上会显示网页预览）。
  - 页面在屏外预渲染。

- visibilitychange 事件，该事件会在文档从隐藏变可见（或反之）时触发。

  - "hidden"
  - "visible"
  - "prerender"

- document.hidden 布尔值，表示页面是否隐藏。这可能意味着页面在后台标签页或浏览器中被最小化了。这个值是为了向后兼容才继续被浏览器支持的，应该优先使用 document.visibilityState 检测页面可见性。

### Streams API

- 可读流 ReadableStream

  - ReadableStreamDefaultController

    - controller.enqueue

  - ReadableStreamDefaultReader

- 可写流 WritableStream

  - WritableStreamDefaultWriter

- 转换流 TransformStream

  - transform

- 通过管道连接流 pipedStream

  - integerStream

    - pipeThrough

      - pipedStream.getReader

        - pipedStreamDefaultReader

    - pipeTo

### 计时 API

- High Resolution Time API

  - window.performance.now
  - performance.timeOrigin

- Performance Timeline API

  - (performance.getEntries

    - PerformanceEntry

      - PerformanceMark
      - PerformanceMeasure
      - PerformanceFrameTiming
      - PerformanceNavigationTiming
      - PerformanceResourceTiming
      - PerformancePaintTiming

### Web 组件

- HTML 模板

  - DocumentFragment
  - template 标签

- 影子 DOM

  - attachShadow(shadowRootInit)
  - 合成与影子 DOM 槽位

    - 命名槽位

- 自定义元素

  - 升级自定义元素

    - 框架衍生

### Web Cryptography API（加密）

- 生成随机数

  - crypto.getRandomValues

- 使用 SubtleCrypto 对象

  - window.crypto. subtle

- 数据加密

  - md5
  - AES
  - RSA
  - ECC
  - HMAC

## 错误处理与调试

### 错误处理

- try/catch 语句
- finally 子句
- throw

### 错误类型

- Error
- InternalError
- EvalError
- RangeError
- ReferenceError
- SyntaxError
- TypeError
- URIError

### 浏览器错误报告

- 建立中心化的错误日志存储和跟踪系统

### 调试技术

- 控制台 console

  - error(message)：在控制台中记录错误消息。
  - info(message)：在控制台中记录信息性内容。
  - log(message)：在控制台记录常规消息。
  - warn(message)：在控制台中记录警告消息。

- 使用 JavaScript 调试器

  - debugger

    - 单步进入、单步跳过、继续

  - 自定义条件断点
  - 请求拦截

- devtools 开发者工具
- 堆栈的执行过程追踪
- 事件捕获、冒泡

## 第三方插件/库

### 地图

- 坐标系的转化

  - WGS-84 坐标系：地心坐标系，GPS 原始坐标体系
  - GCJ-02 坐标系：国测局坐标，火星坐标系
  - BD-09 坐标系:百度中国地图所采用的坐标系，由 GCJ-02 进行进一步的偏移算法得到。

- 分类

  - Bmap
  - googleMap
  - 高德地图

### 图表

- echarts
- 3d

  - d3.js
  - three.js

### 排序

- sortable.js

### 时间格式化

- moment

### 工作流流程绘制

- gojs 流程图绘制

### 通用库

- Lodash
- jQuery

### 在线编辑

- codemirror
- codepen
- codesandbox

### markdown

- simplemde-markdown-editor
- tui.editor
- markdown.it

### 富文本插件

- Tinymce
- ckeditor

### 剪切板

- clipboard

### 语法高亮

- highlight.js
- prism.js

### excel

- xlsx

### 页面加载进度条

- nprogress

### 表单参数格式化

- qs

### 时间传输

- mitt

## UI 库

### 移动端

- vant
- Weex
- uni-app
- wxui（已过时不再更新维护）
- iview（已过时不再更新维护）

### web 端

- element
- antd
- bootstrap

## 风格指南

### 格式化

- prettier
- eslint
- styleLint
- commitlint

### 代码管理

- svn
- git

  - 提交规范

    - husky
    - lint-staged
    - commitizen

      - 约定式提交

### 规范

- 注释规范

  - Jsdoc

- 样式规范

  - BEM 规范

## 三大框架

### Vue

- 生命周期
- vuex

  - 辅助函数

- vue router
- 计算属性与侦听属性
- 双向绑定
- 插槽
- 指令与自定义指令
- Provide / Inject
- mixin 混合

  - 时代最失败的产物

- 类语法使用

  - class-vue-component

- Vue3

  - 组合式 API
  - Vite

    - 新一代模块块打包工具

  - pinia

    - Vuex 替代品

  - typescript 的兼容与类型检测
  - 万恶之源 this 移除
  - Teleport 传送门
  - 异步组件
  - 逻辑关注点分离

    - 业务逻辑内聚

  - hooks

    - VueUseCode

  - vue2 项目迁移升级(不如直接重构)

    - VueCodemod

- 关注点分离

  - 单文件组件的使用

- cli

  - vue-cli
  - nuxt.js

- 测试

  - 单元测试

    - Jest
    - Mocha

  - 组件测试

    - Vue Testing Library
    - Vue Test Utils

  - 端到端 (E2E，end-to-end) 测试

    - Cypress
    - Nightwatch
    - Puppeteer
    - TestCafe

- vue-devtools
- 语法校验

  - vetur
  - volar

### react

- 生命周期
- jsx/tsx 的使用
- redux
- react router
- hook 使用
- react native
- 函数组件与类组件

  - 渲染函数

- cli

  - NextJS
  - Create-React-App
  - umijs
  - dvajs

    - graphQL 查询语句扩展

- React Developer

### angular

### 虚拟节点渲染算法

### MVC、MVVM 模式

## CSS

### 优先级计算

### PostCss 兼容性处理

### 适配

- 像素单位选择

  - px
  - em
  - rem

### 布局

- 弹性布局
- 浮动布局
- 网格布局

### css 原生动画效果

- transform
- transition

### 媒体查询

### 伪元素的绘制

### Font 文字字体

- 留意版权问题

### 预处理

- stylus
- less
- scss/sass

### 图标 iconfont

- 常用类型

  - SVG
  - PNG

- 图标库

  - 阿里巴巴图标库
  - Font Awesome

### CSS 函数

### 文本省略与缩进

### 框架

- Tailwindcss
- WindiCSS

## H5

### 动画与 Canvas 图形

- 2D 绘图上下文
- WebGL

### 媒体元素

- audio 和 video
- video sdk

  - vediojs
  - DPlayer
  - hls player

### 原生拖放

- event

  - dragstart
  - drag
  - dragend
  - dragenter
  - dragover
  - dragleave 或 drop
  - dataTransfer 对象

    - dropEffect 与 effectAllowed
    - addElement
    - clearData
    - setDragImage

### MathML

## 打包工具

### webpack

- 预处理
- 插件
- 代码压缩与提取
- 开发与生产环境划分

### 包管理器

- npm/npx
- yarn
- cnpm

### gulp

## TypeScript

### 类权限修饰符

### 接口

### 继承

### 抽象

### 多态

### 泛型

### 枚举

### 声明文件

### 模块和命名空间

### 引用 reference///

- path
- type

### 配置和编译选项

### swigger 转 typescript 类型定义

- openapi-typescript

### 内置类型

## Node

### 嵌入模块

- fs 文件系统模块

  - 内容批处理

- path 路径模块

  - 文件批操作

- os 操作系统模块

  - 操作系统读取

- express 服务器请求模块

  - http 请求和回应处理

- 事件模块

  - 事件触发器 emitter

### process 进程

### 线程的优先级

### buffer 与流处理

### 异常处理

### nestJS 服务器部署

### TypeORM

### 记录对象

- 堆栈
- 队列

### cli

- koa

## 前后端交互

### 网络请求与远程资源

- tcp 与 udp

  - tcp

    - http

      - Accept：浏览器可以处理的内容类型。
      - Accept-Charset：浏览器可以显示的字符集。
      - Accept-Encoding：浏览器可以处理的压缩编码类型。
      - Accept-Language：浏览器使用的语言。
      - Connection：浏览器与服务器的连接类型。
      - Cookie：页面中设置的 Cookie。
      - Host：发送请求的页面所在的域。
      - Referer：发送请求的页面的 URI。注意，这个字段在 HTTP 规范中就拼错了，所以考虑到兼容性也必须将错就错。（正确的拼写应该是 Referrer。）
      - User-Agent：浏览器的用户代理字符串。

  - udp

- XMLHttpRequest 对象（ajax）

  - responseText：作为响应体返回的文本。
  - responseXML：如果响应的内容类型是"text/xml"或"application/xml"，那就是包含响应数据的 XML DOM 文档。
  - status：响应的 HTTP 状态。
  - statusText：响应的 HTTP 状态描述。
  - readyState

    - 0：未初始化（Uninitialized）。尚未调用 open 方法。
    - 1：已打开（Open）。已调用 open 方法，尚未调用 send 方法。
    - 2：已发送（Sent）。已调用 send 方法，尚未收到响应。
    - 3：接收中（Receiving）。已经收到部分响应。
    - 4：完成（Complete）。已经收到所有响应，可以使用了。

  - timeout 超时
  - overrideMimeType 负载类型重写
  - 进度事件

    - load 事件
    - progress 事件

  - 跨源资源共享（CORS，Cross-Origin Resource Sharing）

    - 预检请求（options）

      - 请求

        - Origin：与简单请求相同。
        - Access-Control-Request-Method：请求希望使用的方法。
        - Access-Control-Request-Headers：（可选）要使用的逗号分隔的自定义头部列表。

      - 响应

        - Access-Control-Allow-Origin：与简单请求相同。
        - Access-Control-Allow-Methods：允许的方法（逗号分隔的列表）。
        - Access-Control-Allow-Headers：服务器允许的头部（逗号分隔的列表）。
        - Access-Control-Max-Age：缓存预检请求的秒数。

    - 凭据请求

      - withCredentials=true

        - Access-Control-Allow-Credentials: true

          - 提供凭据（cookie、HTTP 认证和客户端 SSL 证书）

    - 替代性跨源技术

      - 图片探测
      - JSONP

- Fetch API

  - 自定义选项

    - body
    - cache
    - credentials
    - headers
    - integrity
    - keepalive
    - method
    - mode
    - redirect
    - referrer
    - referrerPolicy
    - signal

  - 中断请求

    - AbortController. abort

  - Headers 对象

    - 头部护卫

      - none
      - request
      - request-no-cors
      - response
      - immutable

  - Request 对象
  - Response 对象

    - Response.redirect 和 Response. error

  - Body 混入

    - text
    - json
    - formData
    - arrayBuffer
    - blob

- Axios API
- Beacon API

  - navigator.sendBeacon

- Web Socket

  - new WebSocket

    - socket

      - event

        - socket.onmessage
        - open：在连接成功建立时触发。
        - error：在发生错误时触发。连接无法存续。
        - close：在连接关闭时触发。

      - methods

        - socket.close
        - socket.send

      - props

        - readyState

### 开发文档交互

- swigger

  - 接口文档

- docShow

  - 数据字典

- typora
- vuepress

### 数据格式

- 表单

  - formData 扩展

- JSON

  - JSON.stringify

    - 自定义 JSON 序列化替代函数 toJSON

  - JSON.parse

    - 自定义 JSON 序列化还原函数

- blob
- file

### 客户端存储（数据持久化处理）

- cookie

  - document.cookie

- Web Storage

  - sessions
  - localStorage

- IndexedDB

  - 对象存储
  - 事务
  - 游标查询
  - 索引

### 测试工具

- postman

### 跨域处理

### 安全防护

- token（令牌）限制
- SSL 限制

## 制图

### 工具

- visio

### 流程图

### 数据流图

### 甘特图

### uml（统一建模语言）

- 静态模型

  - 用例图
  - 类图
  - 对象图
  - 构件图
  - 部署图

- 动态模型

  - 状态图
  - 活动图
  - 顺序图
  - 协作图

## 开发工具

### vscode

### HBuild

### WebStome

### Sublime Text

### Atom

## 移动开发

### 微信公众号

### 小程序

### pwa 本地缓存

## 数据模拟

### monoCloud

### mock

## ps

### 拾色器

- 色彩模式

  - RGBA 模式

    - hex

      - #ffffff

    - decimal

      - 255,255,255,1

  - HSL 色彩模式
  - CYMK 模式
  - LAB 模式

- 转换规则

  - 从 RGB 到 HSL 或 HSV 的转换
  - 从 HSL 到 RGB 的转换

### 切图

### 修图

### 水印

## 需求交流

### 记录

- Xmind 思维导图

### 原型

- 蓝湖
- Axure

## 工程自动化

### AST 抽象语法树（实现原理，与 eslint 等格式化相同）

### 自动化部署

- jenkins
- gitlab cico

  - gh-pages

- github actions
- 环境

  - 虚拟机

    - vmware

  - docker
  - 操作系统

    - centOs7/8

- yaml 语法扩展

### 自动化重构

- jscodeshift

  - codemod

- posthtml
- postcss
- babel

## 优化

### 虚拟加载

### 节流与反抖

### cdn 引入

### 图片加载处理

### 缓存

### SEO 搜索优化

## 设计模式

### 分类

- 创建型模式

  - 工厂模式（Factory Pattern）
  - 抽象工厂模式（Abstract Factory Pattern）
  - 单例模式（Singleton Pattern）
  - 建造者模式（Builder Pattern）
  - 原型模式（Prototype Pattern）

- 结构型模式

  - 适配器模式（Adapter Pattern）
  - 桥接模式（Bridge Pattern）
  - 过滤器模式（Filter、Criteria Pattern）
  - 组合模式（Composite Pattern）
  - 装饰器模式（Decorator Pattern）
  - 外观模式（Facade Pattern）
  - 享元模式（Flyweight Pattern）
  - 代理模式（Proxy Pattern）

- 行为型模式

  - 责任链模式（Chain of Responsibility Pattern）
  - 命令模式（Command Pattern）
  - 解释器模式（Interpreter Pattern）
  - 迭代器模式（Iterator Pattern）
  - 中介者模式（Mediator Pattern）
  - 备忘录模式（Memento Pattern）
  - 观察者模式（Observer Pattern）
  - 状态模式（State Pattern）
  - 空对象模式（Null Object Pattern）
  - 策略模式（Strategy Pattern）
  - 模板模式（Template Pattern）
  - 访问者模式（Visitor Pattern）

### 原则

- 1、开闭原则（Open Close Principle）
- 2、里氏代换原则（Liskov Substitution Principle）
- 3、依赖倒转原则（Dependence Inversion Principle）
- 4、接口隔离原则（Interface Segregation Principle）
- 5、迪米特法则，又称最少知道原则（Demeter Principle）
- 6、合成复用原则（Composite Reuse Principle）

## 书籍

### 前端基础

- 《CSS 权威指南》
- 《CSS 揭秘》
- 《JavaScript 高级程序设计》
- 《JavaScript 语言精粹》
- 《ES6 标准入门》
- 《你不知道的 JS》
- 《JavaScript 权威指南》

### 计算机基础

- 操作系统

  - 《深入理解计算机系统》
  - 《现代操作系统》
  - 《Linux UNIX 系统编程手册》
  - 《UNIX 环境高级编程》

- 计算机网络

  - 《计算机网络自顶向下方法》
  - 《TCP/IP 详解》
  - 《UNIX 网络编程》

- 编译原理

  - 《编译原理》

### 算法和数据结构

- 《算法》
- 《算法导论》
- 《算法竞赛入门经典》
- 《算法竞赛入门经典训练指南》

### 额外扩展

- 《数据结构（C 语言版）》
- 《数据库系统概论》
- 《图解 XX》
- 《Pro Git》
