# Create Vue Monorepo CLI

> 仿照`create-vue`写了一个生成一个 pnpm monorepo 的工作仓库的简单 CLI

- [参考：`create-vue`](https://github.com/vuejs/create-vue#readme)

## 使用

```shell
# 全局安装
pnpm add create-vue-monorepo --global
```

```shell
# 在要建项目的目录下
create-vue-monorepo
```

![演示](https://github.com/laqudee/create-vue-monorepo/blob/master/media/it-work.png)

## 构建

- 渲染核心代码 template
- 渲染配置文件
  - eslint
  - pretrierrc
  - vite.config.js
  - vitest.config.js
  - pnpm-workspace.yaml
- 渲染 package.json

## 舍弃

- 暂时不要生成的定制化 README 改为统一提供
- 暂不考虑 TypeScript

## 创建`packages`目录下业务项目的方式

- 优先推荐作者构建的 `create-vue-business` cli 工具包

- [CLI 工具包 github 地址](https://github.com/laqudee/create-vue-business)

- 安装

```shell
pnpm add vue-establish --global
```

- 使用

```shell
create-vue-business
```

![演示before](https://github.com/laqudee/create-vue-business/blob/main/media/before-business.png)

![演示after](https://github.com/laqudee/create-vue-business/blob/main/media/after-business.png)
