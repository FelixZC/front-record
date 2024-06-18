## react相关记录

### 前言
函数式组件,用得好简化代码，复用灵活；用不好就是纯心智负担
在 React 开发中，我们经常面临三个心智负担：保证状态的不可变性、正确执行副作用以及规避不必要的渲染。

### 优化篇
`React.memo` 和 `React.useMemo` 都是 React 提供的用于性能优化的工具，旨在减少不必要的渲染和计算，但它们的应用场景和使用方式有所不同。

**React.memo**：
- 是一个高阶组件（Higher-Order Component, HOC），专门用于函数组件的性能优化。
- 用于记忆组件的渲染结果，当组件的 `props` 没有改变时，React 会跳过该组件的渲染并复用上一次的渲染结果。
- 主要关注的是整个组件级别的渲染是否需要执行，基于 `props` 的浅比较来决定是否重新渲染。
- 适用于那些渲染输出严格依赖于 `props`，并且渲染成本较高的纯函数组件。
- 可以通过传递第二个比较函数作为参数来自定义 `props` 的比较方式。

**React.useMemo**：
- 是一个 Hook，可以在函数组件内部使用。
- 用于记忆某个计算结果，避免在每次渲染时都重新计算该值，尤其是当计算结果依赖的变量没有变化时。
- 返回一个 memoized（记忆化的）值，并且只有当其依赖项列表中的某个值发生变化时，才会重新计算该值。
- 适用于计算开销大或者频繁调用但结果不经常改变的函数或表达式。
- 更加灵活，可以直接应用于具体值、状态或函数等的计算缓存，颗粒度比 `React.memo` 细。

`React.memo` 用于整个组件的渲染结果缓存，关注点在于组件级别；而 `React.useMemo` 则更加细致，专注于组件内部特定值或计算结果的缓存。两者都是性能优化的重要手段，但根据实际需求和应用场景选择合适的一个。

在React中，除了`React.memo`和`React.useMemo`之外，还有一些其他的工具和Hooks用于优化性能和管理状态，以下是几个相关的概念：

**React.useCallback**:
   - 类似于`React.useMemo`，但它用于记忆函数而不是值。当你将一个函数传递给`useCallback`时，它会返回一个记忆化后的版本，这个版本只有在它的依赖项发生改变时才会被重新创建。
   - 这对于避免在子组件中不必要的重新渲染非常有用，特别是当子组件的性能瓶颈来自于传递的回调函数时。
   - 使用场景包括优化高性能组件或在React.memo内部避免因函数引用改变导致的渲染。

 **React.useRef**:
   - 提供了一个可变的引用对象，其.value属性可以在组件的整个生命周期内保持不变。
   - 不会引起组件重新渲染，常用于保存任何可变的值，比如DOM元素引用或实例状态。
   - 与`useState`不同，即使在组件重新渲染时，`.current`属性的值也会保留。

 **React.useEffect**:
   - 用于执行副作用操作（side effects），如数据获取、订阅或者手动修改DOM等。
   - 可以指定一个依赖项数组，当数组中的值发生变化时，副作用函数会被重新执行。
   - 支持清理函数（return function），在组件卸载前或下次渲染前执行，用于清理副作用，如取消网络请求、移除事件监听器等。

 **React.useContext**:
   - 提供了一种在组件树中传递数据的方式，而不必显式地将props逐层传递。
   - 通过消费一个Context对象，可以让多层组件访问共享的状态。
   - 对于跨层级组件间的通信和状态共享非常有效。

 **React.lazy** 和 **React.Suspense**:
   - `React.lazy`允许你以懒加载的方式动态导入组件，这对于性能优化和提高首次加载速度非常有帮助。
   - `React.Suspense`与`React.lazy`配合使用，可以处理懒加载组件的加载状态，显示加载指示器，直到组件被加载完成。

这些工具和Hooks共同构成了React现代开发中的重要组成部分，帮助开发者更高效地管理状态和优化应用性能。

下面将分别为上述提到的每个概念提供一个简单的示例代码段。

#### React.memo 示例

```jsx
import React, { memo } from 'react';

const ExpensiveComponent = memo(({ value }) => {
  console.log("Rendering ExpensiveComponent");
  return <div>{value}</div>;
});

function ParentComponent() {
  const [counter, setCounter] = React.useState(0);

  return (
    <div>
      <button onClick={() => setCounter(counter + 1)}>Increment</button>
      <ExpensiveComponent value={counter} />
    </div>
  );
}
```
在这个例子中，`ExpensiveComponent` 使用了 `React.memo` 来避免不必要的渲染，除非 `value` 变化。

#### React.useMemo 示例

```jsx
import React, { useMemo } from 'react';

function ComputeExpensiveValue({ a, b }) {
  const result = useMemo(() => {
    console.log("Calculating expensive value...");
    // 假设这是个复杂的计算过程
    return a * a + b * b;
  }, [a, b]);

  return <div>The computed value is: {result}</div>;
}

export default function App() {
  const [numberA, setNumberA] = React.useState(1);
  const [numberB, setNumberB] = React.useState(1);

  return (
    <div>
      <input type="number" value={numberA} onChange={e => setNumberA(Number(e.target.value))} />
      <input type="number" value={numberB} onChange={e => setNumberB(Number(e.target.value))} />
      <ComputeExpensiveValue a={numberA} b={numberB} />
    </div>
  );
}
```
这里，`useMemo` 确保只有当 `a` 或 `b` 改变时，才会重新计算昂贵的值。

#### React.useCallback 示例

```jsx
import React, { useState, useCallback } from 'react';

function ChildComponent({ callback }) {
  console.log("Rendering ChildComponent");
  return <button onClick={callback}>Click me</button>;
}

function ParentComponent() {
  const [count, setCount] = useState(0);
  const incrementCount = useCallback(() => {
    setCount(count + 1);
  }, [count]);

  return (
    <div>
      <ChildComponent callback={incrementCount} />
      <div>Count: {count}</div>
    </div>
  );
}
```
通过 `useCallback`，们确保了 `incrementCount` 只有在 `count` 改变时才会被重新创建，从而避免了不必要的子组件渲染。

#### React.useRef 示例

```jsx
import React, { useRef, useEffect } from 'react';

function TextInputWithFocusButton() {
  const inputEl = useRef(null);

  useEffect(() => {
    // 当组件挂载后自动聚焦输入框
    if (inputEl.current) {
      inputEl.current.focus();
    }
  }, []); // 空依赖数组意味着这个effect只在组件挂载和卸载时运行

  return (
    <>
      <input ref={inputEl} type="text" />
      <button>Focus the input</button>
    </>
  );
}
```
这个例子展示了如何使用 `useRef` 来获取一个到DOM元素的引用，并在组件挂载后自动聚焦输入框。

#### React.useContext 示例

```jsx
// 创建一个context
const ThemeContext = React.createContext();

// 使用context的组件
function Toolbar(props) {
  return (
    <div>
      <ThemedButton />
    </div>
  );
}

function ThemedButton() {
  const theme = React.useContext(ThemeContext);
  return <button style={{ background: theme.background, color: theme.foreground }}>I am styled by theme context</button>;
}

// 提供context的组件
class App extends React.Component {
  render() {
    // 使用一个对象来作为context的值
    return (
      <ThemeContext.Provider value={{ background: "darkblue", foreground: "white" }}>
        <Toolbar />
      </ThemeContext.Provider>
    );
  }
}
```
在这个例子中，`ThemeContext` 被用来在组件树中传递主题信息，而 `ThemedButton` 组件则通过 `useContext` 消费了这个上下文。