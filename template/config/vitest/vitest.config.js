/* eslint-disable no-undef */
import { fileURLToPath } from 'node:url'
import { mergeConfig } from 'vite'
import { configDefaults, defineConfig } from 'vitest/config'
import { createViteConfig } from './vite.config'

const args = process.argv
const projectName = args[3].split('/')[1]
const defaultConfig = await createViteConfig(projectName, '')

export default mergeConfig(
  defaultConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, 'e2e/*'],
      root: fileURLToPath(new URL('./', import.meta.url))
    }
  })
)
