---
icon: hammer
title: Engine Hot-Patching
---

YASCML supports both pre-processed engines and usage with a hot-patching tool. This reference will guide you on how to implement a hot-patching tool.

## Preventing SugarCube Engine Initialization

SugarCube does not initialize immediately after the game launches. Instead, it uses a simple logic to determine whether the current browser environment is suitable for initialization.

Inside the `<head>` tag of a SugarCube game, if you look at the code within `script#script-libraries`, you will find:

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

Then, in `script#script-sugarcube`, you will see the corresponding logic:

```js
if (document.documentElement.getAttribute("data-init") === "loading") {
  // ... engine code
}
```

As you can see, SugarCube first checks whether the current browser environment meets it's requirements. If it does, it sets `<html data-init>` to `loading`, which triggers the engine initialization. Otherwise, `<html data-init>` remains at it's default value `no-js`.

With this knowledge, we can prevent SugarCube from initializing using a small piece of code:

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

After this, you can safely retrieve the SugarCube engine source code from `script#script-sugarcube`.

## Injecting SugarCube Engine Source Code

You can refer to the implementation in [`@yascml/patcher`](https://github.com/yascml/yascml/blob/90bfa8700ddf5b8e8310aaa7a862d8a5bfccd15a/packages/patcher/src/engine.ts#L66). In short, the process can be broken down into the following steps:

1. Remove the outer `if` condition wrapping the engine code.
2. Patch `Object.preventExtensions`, `Object.freeze`, etc., make it won't work.
3. Extract the engine’s [initialization method](https://github.com/tmedwards/sugarcube-2/blob/b40136c17b9e45d0532a92fe8086c58816fc1909/src/sugarcube.js#L180).
4. If the initialization method includes the [definition](https://github.com/tmedwards/sugarcube-2/blob/b40136c17b9e45d0532a92fe8086c58816fc1909/src/sugarcube.js#L125) of the global object `window.SugarCube`, separate it and place it at the same level as the initialization code.
5. If the initialization method is not wrapped in a `Promise`, wrap it in one.
6. Define the global object `window.$SugarCube`. This object is used to export internal methods of the SugarCube engine (such as `Alert` and `LockScreen`), and assign the engine’s initialization method to `window.$SugarCube.$init.initEngine`.

Once these steps are complete, write the processed SugarCube engine code back into `script#script-sugarcube` (or delete and recreate it).

## Exporting the Hot-Patching Tool

Simply assign your hot-patching function to `window.__SUGARCUBE_PATCHER`. Before initialization, YASCML will check whether `window.__SUGARCUBE_PATCHER` is defined. If it is, YASCML will execute it first, and then proceed with its own initialization logic.
