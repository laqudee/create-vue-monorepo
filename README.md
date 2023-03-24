# Create Vue Monorepo CLI

> 仿照`create-vue`写了一个生成一个pnpm monorepo 的工作仓库的简单CLI

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

- 渲染核心代码template
- 渲染配置文件
  - eslint
  - pretrierrc
  - vite.config.js
  - vitest.config.js
  - pnpm-workspace.yaml
- 渲染package.json

## 舍弃
- 暂时不要生成的定制化README改为统一提供
- 暂不考虑TypeScript

## 创建`packages`目录下业务项目的方式

- 优先推荐作者构建的 `vue-establish` cli工具包

- [CLI工具包github地址](https://github.com/laqudee/vue-establish)

- 安装

```shell
pnpm add vue-establish --global
```

- 使用

```shell
vue-establish create <vue-project-name>
```
