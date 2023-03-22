/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import vue from '@vitejs/plugin-vue'
import px2rem from 'postcss-plugin-px2rem'
import { matchViteArgv, createVscodeViteAutoConfig, importViteOptions } from './scripts/utils'

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
  const { px2remOptions, devServer } = await importViteOptions(projectName, command)
  
  return defineConfig({
    root: `./packages/${projectName}/`,
    plugins: [
      vue(),
      AutoImport({
        resolvers: [ElementPlusResolver()]
      }),
      Components({
        resolvers: [ElementPlusResolver()]
      })
    ],
    resolve: {
      alias: {
        '@portal': fileURLToPath(new URL('./packages/portal/src', import.meta.url))
      }
    },
    build: {
      outDir: fileURLToPath(new URL(`./target/${projectName}`, import.meta.url)),
      emptyOutDir: false
    },
    css: {
      postcss: {
        plugins: [px2rem(px2remOptions)]
      }
    },
    server: devServer
  })
}

export default createViteConfig(projectName, command)
