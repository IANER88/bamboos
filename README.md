# grok

一个简易、无虚拟（Virtual DOM）节点、不会重复渲染组件（除去条件渲染）的前端构建库

_关于 Virtual DOM 很多人的误区是以为 Virtual DOM 不需要操作 DOM ，其实不是。 Virtual DOM 是方便 diff 算法的新旧对比， 因为 React 渲染机制是不知道哪个节点变化，当状态改变时是从根组件新旧节点比对下来判断哪个需要改变，从而减少操作 DOM 的开销_

_而 Grok 与 Virtual DOM 渲染机制不同，Grok 采用的是无 Virtual DOM 渲染机制，因为 Grok 可以定位到哪个节点需要改变，不需要从根组件开始一个一个新旧对比来判断哪个节点需要改变，而是当状态改变时，直接操作 DOM_

## 构建应用

通过 createRoot 函数构建应用实例

````tsx
import { createRoot } from 'grok'

createRoot(/* 根组件 */)
````
  createRoot  传入一个根组件，每个应用实例都需要一个根组件，其他的将作为其子组件
```tsx
export default function Root() {
  return (
    <div>root</div>
  )
}
```
```tsx
import { createRoot } form 'grok';
import Root from './root'

createRoot(<Root />)
```
### 挂载应用

应用实例必须调用  .mount  方法后才会渲染出来，给方法接收一个选择器字符串
```tsx
import { createRoot } form 'grok';

createRoot(<Root />).mount('#root')
```

## 语法学习

Grok 使用类似于 React 的 JSX 语法，但是不同于 React 的渲染机制，除去条件渲染的组件，其余组件只会渲染一次，后续的节点改变都是直接操作 DOM 节点

### 插值语法
在 JSX 中，花括号 {} 被称为表达式插值。它们允许你在 JSX 中嵌入 JavaScript 表达式
```tsx
export default function Root(){
  const count = 0;
  return (
    <div>{count}</div>
  )
}
```

### 属性绑定
同理在 JSX 中，在属性上使用插值表达式也是使用 {}
```tsx
export default function Root(){
  const count = 0;
  const id = 'app'
  return (
    <div id={id}>{count}</div>
  )
}
```


## 响应式基础

### useSignal
用 useSignal 声明响应式状态
```tsx
import { useSignal } from 'grok'

const count = useSignal(0);
```
useSignal   接收参数，然后返回一个包裹着 .value 的 Signal 构造函数中返回
```tsx
const count = useSignal(0)

console.log(count) // { value: 0 }
console.log(count.value) // 0

count.value++
console.log(count.value) // 1
```
需要在 JSX 中使用状态，需要 .value 出来，这样才能让程序追踪到给该状态依赖的节点
```tsx
import { useSignal } from 'grok'

export default function Root(){

  const count = useSignal(0)
  
  return (
    <div>{count.value}</div>
  )
}
```
当我们通过 .value 修改状态的时候，会更新依赖的节点
```tsx
import { useSignal } from 'grok'

export default function Root(){

  const count = useSignal(0)

  setInterval(( ) => {
    count.value++
  }, 1000)
  
  return (
    <div>{count.value}</div>
  )
}
```
### 为何需要 .value
因为 Grok 使用的观察发布模式，先使用 new Proxy 对状态进行一次劫持，~~当在初次组件渲染的时候 .value 就会收集当前的节点在 #observers 集合上，当 .value 修改状态的时候，就会遍历更新 #observers 上的节点~~

当在初次渲染的时候，程序会收集 .value 状态绑定的节点，分别收集在当前 Signal 构造函数上的 #content、#attribute、#determine、#tabulate 上，当状态发生改变就会遍历更新节点
```ts
/**类似代码**/
const signal = new Proxy({
  value: 0,
}, {
  get: () => {
    // 观察
  },
  set: () => {
    // 发布
  }
})
```
