# 在`packages`中创建新的`VUE`项目指南

## 优先推荐

> 优先推荐作者构建的 `create-vue-business` cli 工具包

### 安装与使用

- [CLI 工具包 github 地址](https://github.com/laqudee/create-vue-business)

- 安装

```shell
pnpm add create-vue-business --global
```

- 使用

```shell
create-vue-business
```

## 其他方式说明

### 1. 创建阶段

> 以`pnpm create vue@latest`为例

1. 在终端切换到`packages`目录下，使用`pnpm create vue@latest`创建一个 Vue 项目
2. 由于本项目使用 ESLint 检查格式，使用 Vitest 进行单元测试，推荐勾选`eslint`、`prettier`和`vitest`选项
3. 本项目暂不支持 TypeScript、JSX 和 TSX，故没有相关配置

### 2. `vue-demo`项目中的修改

> 新的 VUE 项目我们假设为`vue-demo`

1. 删除`vue-demo`目录下的如下配置文件：

   - `.eslintrc.cjs`
   - `.prettierrc.json`
   - `vite.config.js`
   - `vitest.config.js`
   - 原因是：我们在项目最外层（根目录）使用统一的配置和脚本执行命令

2. 在`vue-demo`中的`package.json`中添加：

```json
  "type": "module",
```

- 原因是：整个项目采用 esm 构建，所以需要在`vue-demo`中指明

3. 在`vue-demo`中的`package.json`中，删除`scripts`配置选项：

- 原因是：项目采用统一的根目录脚本命令执行，不需要在业务项目中单独配置

4. 在`vue-demo`根目录添加`server.js`和`setting.js`文件

- `server.js`作为项目根目录`vite.config.js`中的 server 选项，配置专属开发服务器
- `setting.js`作为项目根目录`vite.config.js`中的其他选项配置，例如 css 选项里的 postcss 项目
- 修改根目录`vite.config.js`中其他配置选项，一定要注意其他业务项目是否正常运行，原则上不允许修改根目录的`vite.cofig.js`中配置

### 3. 在根目录`vite.config.js`中的修改

- `resolve`选项中，添加`vue-demo`项目相关的别名

```js
return defineConfig({
  resolve: {
    alias: {
      '@one': fileURLToPath(new URL('./packages/vue-demo-one/src', import.meta.url)),
      '@two': fileURLToPath(new URL('./packages/vue-demo-two/src', import.meta.url))
    }
  }
})
```

### 不按照本指南新建项目的一些说明

1. 完全可以不按照本指南进行新建业务项目
2. 即创建一个保留`vite.config.js`等配置文件的完整项目
3. 这个项目内部是完整的且可以独立启动的
4. 但这个项目不能使用外部的统一脚本执行命令（会出现一些报错）

## 最后的说明

> 这个创建业务项目的说明可能有些麻烦，【开发者正在努力磨平这些麻烦】。但是按照这个指南创建的业务项目将与其他业务项目的内部与外部表现一致。
