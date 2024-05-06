// 引入RxJS的核心模块
import {
  fromEvent,
  map,
  from,
  combineLatest
} from 'rxjs';
function useClickObserve() {

  // 创建一个Observable，监听document上的点击事件
  const click$ = fromEvent(document, 'click');

  // 使用map操作符转换数据流，将鼠标点击事件对象映射为字符串消息
  const message$ = click$.pipe(
    map(event => `Clicked at coordinates (${event.clientX}, ${event.clientY})`)
  );

  // 订阅message$ Observable，打印每次点击的位置信息
  message$.subscribe(message => console.log(message));
}

function useFetchObserve() {
  // 模拟从API获取的数据列表
  const fetchData = () => new Promise(resolve =>
    setTimeout(() => resolve([{
        id: 1,
        name: 'Alice'
      },
      {
        id: 2,
        name: 'Bob'
      },
      {
        id: 3,
        name: 'Charlie'
      },
      {
        id: 4,
        name: 'Diana'
      }
    ]), 1000)
  );

  // 创建一个Observable来模拟API调用
  const data$ = from(fetchData()).pipe(
    map(data => data) // 这里可以添加更多数据处理逻辑
  );

  // 监听搜索框的输入事件
  const searchBox = document.getElementById('searchBox');
  const searchText$ = fromEvent(searchBox, 'input').pipe(
    map(event => event.target.value.trim().toLowerCase())
  );

  // 结合数据源和搜索条件，实时过滤数据
  const filteredData$ = combineLatest([data$, searchText$]).pipe(
    map(([data, searchTerm]) =>
      searchTerm ? data.filter(item => item.name.toLowerCase().includes(searchTerm)) : data
    )
  );

  // 将过滤后的数据渲染到页面
  filteredData$.subscribe(data => {
    const resultList = document.getElementById('resultList');
    resultList.innerHTML = ''; // 清空之前的结果
    data.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item.name;
      li.classList.add('item');
      resultList.appendChild(li);
    });
  });

  // 初始化数据加载
  data$.subscribe();
}
useClickObserve()
useFetchObserve()