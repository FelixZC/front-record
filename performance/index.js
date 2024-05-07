/**
 * 记录和分析页面加载性能。
 * 使用PerformanceNavigationTiming接口获取页面加载的相关性能指标。
 */
function logPageLoadMetrics() {
    if (performance.getEntriesByType("navigation").length > 0) {
        const perfData = performance.getEntriesByType("navigation")[0];
        console.log("页面加载性能数据:");
        console.log(`- DNS查询时间: ${perfData.domainLookupEnd - perfData.domainLookupStart} ms`);
        console.log(`- TCP连接时间: ${perfData.connectEnd - perfData.connectStart} ms`);
        console.log(`- 请求响应时间: ${perfData.responseEnd - perfData.requestStart} ms`);
        console.log(`- 首次内容绘制(FMP): ${perfData.rendering.firstContentfulPaint} ms`);
        console.log(`- 白屏到加载完成时间: ${perfData.loadEventEnd - perfData.navigationStart} ms`);
    } else {
        console.warn("无法获取页面加载性能数据");
    }
}

/**
 * 监控指定URL模式的资源加载时间。
 * @param {string} urlPattern - 资源URL的模式。
 */
function monitorResourceLoad(urlPattern) {
    const resources = performance.getEntriesByType("resource");
    for (let i = 0; i < resources.length; i++) {
        if (resources[i].name.includes(urlPattern)) {
            console.log(`资源 "${resources[i].name}" 加载详情:`);
            console.log(`- 请求开始到响应结束: ${resources[i].responseEnd - resources[i].fetchStart} ms`);
            console.log(`- DNS查询到响应接收: ${resources[i].responseEnd - resources[i].domainLookupStart} ms`);
            break; // 假设只查找第一个匹配的资源
        }
    }
}

/**
 * 测量指定函数执行的时间。
 * @param {Function} fn - 需要测量执行时间的函数。
 */
function measureFunctionExecution(fn) {
    const startTime = performance.now();
    fn(); // 执行测量的函数
    const endTime = performance.now();
    console.log(`函数执行耗时: ${endTime - startTime} ms`);
}

// 示例使用
// measureFunctionExecution(() => {
//     // 放置你需要测试的代码
//     for (let i = 0; i < 1000000; i++) {
//         // 模拟操作
//     }
// });

/**
 * 记录首次绘制（First Paint）与首次内容绘制（First Contentful Paint）的时间。
 * 使用 PerformanceNavigationTiming 和 PerformanceObserver 来提高兼容性和准确性。
 */
function logFirstPaintAndContentfulPaint() {
    // 使用 PerformanceNavigationTiming 来获取 First Paint 时间
    const performanceEntries = performance.getEntriesByType('paint');
    let firstPaint = performanceEntries.length > 0 ? performanceEntries[0].startTime : 0;

    // 使用 PerformanceObserver 来监听 First Contentful Paint
    const observer = new PerformanceObserver((entries) => {
        // 只记录第一个 First Contentful Paint 事件
        let firstContentfulPaint = entries[0].startTime;
        console.log(`首次内容绘制时间 (First Contentful Paint): ${firstContentfulPaint} ms`);
        observer.disconnect(); // 断开监听
    });
    observer.observe({
        entryTypes: ['paint']
    });

    // 输出 First Paint 时间，若 First Contentful Paint 未发生则输出相应信息
    console.log(`首次绘制时间 (First Paint): ${firstPaint} ms`);
    if (firstPaint === 0) {
        console.log("首次绘制时间数据不可用");
    }
}

// 调用函数
// logFirstPaintAndContentfulPaint();


/**
 * 用户交互延迟（Long Task）检测
 * 长时间运行的脚本会阻塞主线程，影响用户体验。通过监测长任务，可以识别并优化这些瓶颈。
 */
function monitorLongTasks() {
    const longTaskObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
            console.log(`长任务警告: 耗时 ${entry.duration} ms, 开始于 ${new Date(entry.startTime).toISOString()}`);
        });
    });

    longTaskObserver.observe({
        entryTypes: ['longtask']
    });
}

/**
 * 网络请求重定向和重试统计
 * 有时候了解资源加载过程中是否发生重定向或重试也很重要，这可以帮助诊断网络问题。
 */
function logRedirectsAndRetries() {
    const resources = performance.getEntriesByType('resource');
    resources.forEach(resource => {
        if (resource.redirectCount > 0) {
            console.log(`资源 "${resource.name}" 发生了 ${resource.redirectCount} 次重定向.`);
        }
        if (resource.transferSize > resource.encodedBodySize) {
            console.log(`资源 "${resource.name}" 可能进行了重试.`);
        }
    });
}

/**
 * 使用 Performance Observer 监控Frame Rate (FPS)
 * 对于动画密集型应用，维持高帧率至关重要。可以通过监听frame类型的PerformanceEntry来监控每一帧的渲染时间，进而推算出FPS。
 */
function observeFrameRate() {
    const frameObserver = new PerformanceObserver((list) => {
        const frames = list.getEntries();
        const lastFrame = frames[frames.length - 1];
        const fps = Math.round(1000 / lastFrame.duration);
        console.log(`当前帧率 (FPS): ${fps}`);
    });

    frameObserver.observe({
        type: 'frame',
        buffered: true
    });
}

/**
 * 使用 Resource Timing 进行细粒度资源加载优化
 * Resource Timing API 提供了关于页面加载的所有网络请求的详细时序信息，包括DNS查询时间、TCP连接时间等，这对于优化资源加载序列和策略非常有帮助。
 */
function analyzeResourceTiming() {
    const resources = performance.getEntriesByType('resource');
    resources.forEach(resource => {
        console.log(`资源 "${resource.name}" 加载详情:`);
        console.log(`- DNS查询时间: ${resource.domainLookupEnd - resource.domainLookupStart} ms`);
        console.log(`- TCP连接时间: ${resource.connectEnd - resource.connectStart} ms`);
        console.log(`- 请求发送到响应接收时间: ${resource.responseEnd - resource.requestStart} ms`);
    });
}

/**
 * 利用Largest Contentful Paint (LCP) 优化视觉加载体验
 * Largest Contentful Paint 是衡量用户认为页面主要内容已加载完成的一个重要指标。它标识了页面上最大内容块（如文本块或图片）渲染完成的时间点。
 */
function logLargestContentfulPaint() {
    const lcpObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntriesByType('largest-contentful-paint')) {
            console.log(`最大的内容块渲染时间 (LCP): ${entry.renderTime} ms`);
        }
    });

    lcpObserver.observe({
        type: 'largest-contentful-paint',
        buffered: true
    });
}