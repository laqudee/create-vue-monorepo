# Create Vue Monorepo CLI

> 仿照`create-vue`写了一个生成一个pnpm monorepo 的工作仓库的简单CLI

- [参考：`create-vue`](https://github.com/vuejs/create-vue#readme)

## 使用

```shell
# 全局安装
pnpm add create-vue-monorepo --global

# 在要建项目的目录下
```shell
create-vue-monorepo
```


## 构建

- 渲染核心代码template
- 渲染配置文件
  - eslint
  - pretrierrc
  - vite.config.js
  - vitest.config.js
  - pnpm-workspace.yaml
  - 等
- 渲染package.json

### 舍弃

- 暂时不要生成的README。改为统一提供