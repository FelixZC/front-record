import React, { useEffect } from 'react';

function MyComponent() {
  useEffect(() => {
    function handleIdle(deadline) {
      // 判断是否有足够的空闲时间来执行任务
      if (deadline.timeRemaining() > 0) {
        console.log('执行空闲任务...');
        // 这里可以执行一些CPU密集型任务，如大量计算或DOM操作
        // 注意：要检查剩余时间，避免阻塞UI
      } else {
        // 如果当前帧时间不足，可以选择请求下一次空闲回调
        requestIdleCallback(handleIdle);
      }
    }

    // 请求空闲回调
    const id = requestIdleCallback(handleIdle);

    // 清理函数，取消未执行的空闲回调请求
    return () => cancelIdleCallback(id);
  }, []); // 确保只在组件挂载和卸载时执行

  return (
    <div>
      <h2>我的组件</h2>
      {/* 组件的其他内容 */}
    </div>
  );
}

export default MyComponent;