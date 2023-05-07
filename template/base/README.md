# Vue Vite Pnpm Monrepo 搭建指南

- [Vue Vite Pnpm Monrepo 搭建指南](#vue-vite-pnpm-monrepo-搭建指南)
  - [技术栈](#技术栈)
  - [`packages`下项目解释](#packages下项目解释)
    - [根目录`package.json`中`scripts`中的命令解释](#根目录packagejson中scripts中的命令解释)
  - [关于 Vue2 项目的说明](#关于vue2项目的说明)
    - [支持 Vue2 的方式](#支持vue2的方式)
  - [脚本执行方式说明](#脚本执行方式说明)
    - [使用到的辅助库（包）](#使用到的辅助库包)
    - [脚本执行顺序](#脚本执行顺序)
  - [项目结构说明](#项目结构说明)
  - [项目目录名称规范](#项目目录名称规范)
  - [创建新 VUE 业务项目的指南](#创建新vue业务项目的指南)
    - [简单的指南](#简单的指南)
  - [自适应设置案例](#自适应设置案例)
  - [解决 VS Code + Vite 插件 自启动时 BUG](#解决-vs-code--vite-插件-自启动时-bug)
    - [代码](#代码)
  - [存在的问题](#存在的问题)
  - [引入`TypeScript`的可行性](#引入typescript的可行性)

## 技术栈

| 基础           | 版本     |
| :------------- | :------- |
| node.js        | ^16.14.0 |
| pnpm           | ^7.26.0  |
| pnpm workspace | --       |

| 库名称     | 版本    |
| :--------- | :------ |
| Vue        | ^3.2.47 |
| Vite       | ^4.1.4  |
| Vitest     | ^0.29.1 |
| Vue-Router | ^4.1.6  |
| Pinia      | ^2.0.32 |

## `packages`下项目解释

| 项目名称          | 说明                                                                         |
| :---------------- | :--------------------------------------------------------------------------- |
| common-components | 存放可以抽离的共用组件，有意做成类 vueuse 方式                               |
| common-toolbox    | 存放供组件库和业务项目使用的公共方法和函数，目标：后期可以抽离成单独的工具库 |
| business-xx       | 业务项目代码                                                                 |
| ......            | 后期可以直接添加门户相关的其他业务项目                                       |

### 根目录`package.json`中`scripts`中的命令解释

```json
"scripts": {
   "dev": "node ./scripts/dev.js",
   "build": "node ./scripts/build.js",
   "preview": "node ./scripts/preview.js",
   "lint": "eslint . --ext .vue,.js,.jsx,.cjs,.mjs --fix --ignore-path .gitignore",
   "format": "prettier --write packages/",
   "test": "node ./scripts/test.js",
   "rollup:build": "pnpm -F ./packages/common-toolbox build"
},
```

| 命令            | 命令示例                                                            | 说明                                                                                                                                         | 完整度 |
| :-------------- | :------------------------------------------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------- | :----- |
| `dev`           | `pnpm dev business-xx1 business-xx2 ..` 或者直接 `pnpm dev`         | 启动一个或多个 vue 项目的开发服务器，dev 后跟 package 中业务项目名称（非`common-`开头的目录）；直接使用`pnpm dev`将提供可选择的项目用来执行  | 可用   |
| `build`         | `pnpm build business-xx1 business-xx2 ..` 或者直接 `pnpm build`     | 对一个或多个 vue 项目进行打包，build 后跟 packages 中的业务项目名称（非`common-`开头的目录）；直接使用`pnpm build`将提供可选择的项目用来执行 | 可用   |
| `preview`       | `pnpm preview business-xx1 business-xx2 ..` 或者直接 `pnpm preview` | 对打包后的 dist 进行预览，preview 后跟 packages 中业务项目名称（非`common-`开头的目录）；直接使用`pnpm preview`将提供可选择的项目用来执行    | 可用   |
| `lint`          | `pnpm lint`                                                         | 对整个项目进行 ESLint 检查，包含所有的工作空间和其他指定格式文件                                                                             | 可用   |
| `format`        | `pnpm format`                                                       | 对 packages 中的项目代码进行格式化                                                                                                           | 可用   |
| `test`          | `pnpm test business-xx`                                             | 使用 vitest 对项目进行单元测试， 目前支不支持对多个项目进行同时测试，只允许每次测试一个业务项目                                              | 可用   |
| `rollup:build ` | `pnpm rollup:build`                                                 | 对`common-toolobax`进行 rollup 打包                                                                                                          | 测试中 |

> 后续会随着项目逐渐完善，命令会最终定稿...

## 关于 Vue2 项目的说明

> 原本该脚本生成的`pnpm workspace`是没有计划支持 Vue2 项目的，但由于一些特殊的业务因为条件的限制只能使用 vue2 版本。所以在`v0.0.4`版本中支持了 Vue2 项目

### 支持 Vue2 的方式

- 由于原计划`packages`目录下的业务代码均使用统一的外部`vite.config.js`配置，但是 Vue2 和 Vue3 项目所依赖的库的版本均不相同，所以无法统一处理
- 因此对 Vue2 项目，采用读取其项目内部`vite.config.js`配置的方式来开发、构建
- 这样，就在一定程度上避免了支持 Vue2 项目带来的混乱

## 脚本执行方式说明

### 使用到的辅助库（包）

```shell
$ execa
$ inquirer
$ colorette
```

### 脚本执行顺序

- 由于此项目采用统一`vite.config.js`管理所有的业务项目，所以当在终端执行`pnpm dev`时，会执行`node ./scripts/dev.js`；`dev.js`内部调用`utils.js`内部的`commandRunner(args, options)`
- 在`commandRunner`函数中会检查命令行参数个数：
  - 如果没有参数将会提供`packages`目录下的业务项目供选择，执行`chooseOneRun()`；
  - 如果有参数（允许多个参数：业务项目名），直接调用`execa`执行 vite 命令
- 在获取可供选择的业务项目时，已经过滤掉以`common-`开头的公共模块或组件或工具包

## 项目结构说明

> 在 windows 下使用`tree`和`tree /f >tree.txt`完成项目结构绘画

```shell
│  .eslintrc.cjs          # ESLint 检查配置文件
│  .gitignore
│  .prettierignore        # pnpm format时忽略哪些文件
│  .prettierrc.json       # pnpm format 配置
│  package.json
│  pnpm-lock.yaml
│  pnpm-workspace.yaml    # 工作空间配置
│  README.md
│  vite.config.js         # vite 配置
│  vitest.config.js       # vitest 单元测试配置
│
├─packages                # 工作空间
│  ├─common-components         # 公共组件存放目录
│  │
│  ├─common-toolbox       # 公共工具存放目录
│  │
│  └─business-xx               # 业务项目
│
└─scripts                 # 脚本相关目录
        build.js          # 业务项目构建相关，例如 pnpm build business-xx
        dev.js            # 业务项目开发相关，例如 pnpm dev business-xx
        preview.js        # 预览构建完成的包，例如 pnpm preview business-xx
        utils.js          # 脚本相关工具库
└─target                  # 构建完成的包存放目录
    └─business-xx              # business-xx业务项目包存放目录
```

## 项目目录名称规范

> 由于一些脚本的执行可能用到目录名称，所以对目录名称做出一些规范要求

| 所属目录   | 名称规范              | 说明                                                                                            |
| :--------- | :-------------------- | :---------------------------------------------------------------------------------------------- |
| `packages` | `common-`             | `packages`工作空间中以`common-`开头的项目（目录）均表示公共的模块，不是业务项目                 |
| 业务项目   | `server.js`           | 在业务项目根目录中定义`server.js`，该文件中定义`vite.config.js`可能用到的`server`选项           |
| 业务项目   | `viteCustomConfig.js` | 在业务项目根目录中定义`viteCustomConfig.js`，该文件中定义`vite.config.js`可能用到的其他选项配置 |

## 创建新 VUE 业务项目的指南

> 优先推荐作者写的 CLI 工具包 [`create-vue-business`](https://github.com/laqudee/create-vue-business)，`create-vue-business `直接生成符合要求的 Vue 业务项目基本框架

### [简单的指南](./CREATE-NEW-VUE-PROJECT-README.md)

> 后期计划

- [x] 完善`Vitest`单元测试体系与命令
- [x] 完善`Eslint` + `Prettier`的代码格式修正与检查

## 自适应设置案例

- `postcss`

```sh
pnpm add amfe-flexible -w -D
pnpm add postcss-plugin-px2rem -w -D

# 在 business-xx仓库中安装
pnpm add amfe-flexible
pnpm add postcss-plugin-px2rem
```

```js
// vite.config.js
// 以web端为例
import px2rem from 'postcss-plugin-px2rem'

export default defineConfig(async ({ command, mode }) => {
  const px2remOptions = await import(`./packages/${projectName}/viteCustomConfig.js`).then(
    (module) => module.px2remOptions
  )

  return {
    css: {
      postcss: {
        plugins: [px2rem(px2remOptions)]
      }
    }
  }
})
```

```js
// 在packages/business-xx项目根目录
// 添加 viteCustomConfig.js
export const px2remOptions = {
  rootValue: 16,
  unitPrecision: 5,
  mediaQuery: false,
  minPixelValue: 0
}
```

```js
// 在common-toolbox中dom目录下
// common.js
// 以web端为例

/**
 * @description 以1920底图为基准开发页面
 */
export const setFontSize = () => {
  window.useRem = true
  const baseSize = 16
  ;(function (doc, win) {
    setRem()
    let resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
      recalc = function () {
        setRem()
      }
    if (!doc.addEventListener) return
    win.addEventListener(resizeEvt, recalc, false)
  })(document, window)

  function setRem() {
    // 当前页面宽度相对于 1920宽的缩放比例，可根据自己需要修改
    // const scale = document.documentElement.clientHeight / 1080;
    const scale = document.documentElement.clientWidth / 1920
    // 设置页面根节点字体大小（“Math.min(scale, 2)” 指最高放大比例为2，可根据实际业务需求调整）
    document.documentElement.style.fontSize = baseSize * Math.min(scale, 5) + 'px'
  }
}
```

## 解决 VS Code + Vite 插件 自启动时 BUG

- 自启动命令：`npx vite --port=4000`

- 产生启动失败的原因分析：

  - 项目采用 pnpm workspace 管理 monorepo。多个业务项目共用一个根目录下的`vite.config.js`配置文件。这种方式是没有问题的，但是 VS Code + Vite 插件的自启不会指定 root。
  - 由于我们改写了根目录下的脚本执行方式，导致这种自启方式没有指定一个`packages`下的业务项目。因此`vite.config.js`配置中的`root`选项就默认为`vite.config.js`所在的根目录，这个根目录没有`index.html`入口，所以导致启动失败。

- 解决方式：
  - 调用`matchViteArgv(args)`分析 vite 命令得到的参数，是否包含`packages/`开头的参数
  - 如果没有（函数返回值为 false），则判断为 VS Code + Vite 插件自启动。调用`await createVscodeViteAutoConfig()`，默认给定第一个业务项目
  - 如果有（函数返回 true），则为手动启动，走正常流程
  - 最重要的一步：在`defineConfig()`中添加`root`选项`root`: `./packages/${projectName}/`

### 代码

```js
// vite.config.js
// ...
import { matchViteArgv, createVscodeViteAutoConfig } from './scripts/utils'

const args = process.argv
const command = args[2]
let projectName
if (!matchViteArgv(args)) {
  // 解决vscode中vite插件使用npx vite --port=4000自启时，缺少指定root目录的问题
  projectName = await createVscodeViteAutoConfig()
} else {
  projectName = args[3].split('/')[1]
}

export async function createViteConfig(projectName, command) {
  // ...
  return defineConfig({
    root: `./packages/${projectName}/`
    // ...
  })
}

export default createViteConfig(projectName, command)
```

```js
// scripts/utils.js

export const matchViteArgv = (argv) => {
  return argv.some((it) => /^packages/.test(it))
}

export const createVscodeViteAutoConfig = async () => {
  const list = await getBusinessFolder()
  return list[0]
}
```

## 存在的问题

- [x] ~~`common-toolbox`工具库应尽量只存放项目相关工具函数而不存放 monorepo 相关打包配置工具，方便后期整体抽离~~
- [x] ~~`axios`工具存放在每个项目中还是集中存放在`common-toolbox`中~~
- [x] ~~`scripts`中`dev.js` `build.js` `preview.js`中相同代码过高，考虑抽离~~
- [x] ~~配置`vite.config.js`将项目打包输出到同一个文件夹，文件夹中输出的 dist 命名为`target/business-xx` `target/other-vuet`~~
- [x] ~~启用`Eslint`检查~~
- [x] ~~修复`VS Code`编辑器插件`Vite`自启动，启动服务器失败 BUG~~
- [x] ~~完善 vitest 单元测试脚本~~
- [x] ~~修复 vite.config.js 中，默认查找`server.js`与`viteCustomConfig.js`的 bug，尽管一个正常的业务项目都会配置这些，但很难保证用户不会另辟蹊径！~~
- [ ] **pnpm 下载依赖 到指定目录研究**【待解决】
- [ ] _不同项目或库使用统一脚本入口执行打包的可行性 【待研究】_
- [ ] 一个业务项目有 server.js 一个项目没有 server.js，启动有问题
- [ ] 在 esm 项目中使用 cjs 包的问题
  - 考虑使用`import commonjs from '@rollup/plugin-commonjs'`将 cjs 包转为 esm 模式来使用

## 引入`TypeScript`的可行性

> TypeScript 的配置文件怎么越来越多`[DOG]`...
