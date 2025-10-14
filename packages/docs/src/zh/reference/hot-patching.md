---
icon: hammer
title: 引擎热补丁
---

YASCML 既支持预先处理过的引擎，也支持与热补丁工具一起使用。本参考将指导如何编写一个热补丁工具。

## 阻止 SugarCube 引擎初始化

SugarCube 并不是在游戏运行后就马上初始化的，相反它会通过一些简单的逻辑来判断当前浏览器环境是否适合初始化。

在 SugarCube 游戏的 `<head>` 标签内，查看 `script#script-libraries` 内的代码，我们会发现这一句：

```js
if (
  document.head &&
  document.addEventListener &&
  document.querySelector &&
  Object.create &&
  Object.freeze &&
  JSON
){
  document.documentElement.setAttribute("data-init", "loading");
  // ...
}
```

然后查看 `script#script-sugarcube`，我们能发现其配套的逻辑：

```js
if (document.documentElement.getAttribute("data-init") === "loading") {
  // ... engine code
}
```

不难发现，SugarCube 会首先判断当前浏览器环境是否符合其要求，如果符合，就将 `<html data-init>` 设置为 `loading`，并以此让引擎初始化。反之，则 `<html data-init>` 会保持默认的 `no-js`。

了解了 SugarCube 引擎的初始化逻辑后，我们可以通过一些简单的代码来阻止 SugarCube 引擎初始化：

```ts
// Prevent SugarCube from initializing
document.documentElement.setAttribute('data-init', 'yascml-loading');

// Prevent the `data-init` attribute from being modified by others
const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    if (mutation.type === 'childList') continue;
    if (mutation.type === 'characterData') continue;
    if (mutation.attributeName !== 'data-init') continue;
    if (document.documentElement.getAttribute('data-init') === 'yascml-loading') continue;

    document.documentElement.setAttribute('data-init', 'yascml-loading');
  }
});
observer.observe(document.documentElement, { attributes: true, attributeFilter: [ 'data-init' ] });
```

之后我们便可在 `script#script-sugarcube` 内获取 SugarCube 引擎代码了。

## 注入 SugarCube 引擎代码

您可以参考 [`@yascml/patcher`](https://github.com/yascml/yascml/blob/90bfa8700ddf5b8e8310aaa7a862d8a5bfccd15a/packages/patcher/src/engine.ts#L66) 的处理流程。简单来讲，大致可以分为如下几步：

1. 去掉引擎代码最外围的 `if` 判断逻辑
2. 提取引擎的 [初始化方法](https://github.com/tmedwards/sugarcube-2/blob/b40136c17b9e45d0532a92fe8086c58816fc1909/src/sugarcube.js#L180)
3. 如果引擎的初始化方法中包括对 `window.SugarCube` 全局对象的 [定义逻辑](https://github.com/tmedwards/sugarcube-2/blob/b40136c17b9e45d0532a92fe8086c58816fc1909/src/sugarcube.js#L125)，则将其拆出并与初始化代码同级
4. 如果引擎的初始化方法没有被 `Promise` 包裹，则将其用 `Promise` 包起来
5. 定义 `window.$SugarCube` 全局对象，该对象将用于导出 SugarCube 引擎的内部方法（例如 `Alert` 与 `LockScreen`），并将引擎的初始化方法定义到 `window.$SugarCube.$init.initEngine` 中

以上操作处理完成后，将处理好的 SugarCube 引擎代码写回 `script#script-sugarcube`（或删除并重新创建该标签）即可。

## 导出热补丁工具

将热补丁逻辑函数定义到 `window.__SUGARCUBE_PATCHER` 即可。YASCML 会在初始化前判断 `window.__SUGARCUBE_PATCHER` 是否被定义，如果该方法被定义，则首先运行该方法，然后再执行初始化逻辑。
