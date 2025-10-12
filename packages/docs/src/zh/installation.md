---
icon: floppy-disk
title: 安装 YASCML
prev: false
---

YASCML 提供多种安装方式，您可以根据需求选择合适的安装方法。

## 使用在线安装工具安装

访问 [在线安装工具](https://yascml.github.io/install/)，跟随安装向导即可。

## 使用 CLI 安装

### 从 GitHub Packages Registry 安装 CLI

首先您需要在 GitHub 上创建一个 Personal Access Token (classic)，并为其授予 `read:packages` 权限。

然后，使用如下命令登录：

:::tabs#npm

@tab npm

```bash
npm login --scope=@yascml --auth-type=legacy --registry=https://npm.pkg.github.com

> Username: USERNAME
> Password: TOKEN
```
:::

然后即可通过 GitHub Packages Registry 安装 CLI：

::: tabs#npm

@tab npm

```bash
npm install @yascml/patcher -g --registry=https://npm.pkg.github.com
```

@tab yarn

```bash
yarn add @yascml/patcher -g --registry=https://npm.pkg.github.com
```

@tab pnpm

```bash
pnpm add @yascml/patcher -g --registry=https://npm.pkg.github.com
```

:::

然后运行 `yascpatcher` 或 `npx yascpatcher`（如果前者不存在）即可使用 CLI。
