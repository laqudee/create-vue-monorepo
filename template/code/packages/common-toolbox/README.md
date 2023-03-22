# Common-toolbox

> 专注服务于组件库的可复用工具库

- 目前打包成两种格式：
  - ESM
  - CJS

## 打包方式

- `rollup`

## 现有可用工具

| 工具名称        | 签名                                     | 说明                                                            |
| :-------------- | :--------------------------------------- | :-------------------------------------------------------------- |
| `createAxios`   | `createAxios(options) -> axios instance` | axios 实例生成器，将公共部分抽离，使项目中的 axios 配置代码简洁 |
| `createEncrypt` | `createEncrypt(publicKey) -> function`   | 加密器抽离                                                      |
| `formater`      | `Object`                                 | 包含一些常见的格式化工具                                        |
| `validator`     | `Object`                                 | 包含常见类型的校验方式                                          |
| ...             | ...                                      | ...                                                             |
