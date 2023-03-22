import * as fs from 'node:fs'
import * as path from 'node:path'

import createESLintConfig from '@vue/create-eslint-config'

import sortDependencies from './sortDependencies'
import deepMerge from './deepMerge'

export default function renderEslint(rootDir, { needsPrettier }) {
  const additionalConfig = {}
  const additionalDependencies = {}

  const { pkg, files } = createESLintConfig({
    vueVersion: '3.x',
    // we currently don't support other style guides
    styleGuide: 'default',
    hasTypeScript: false,
    needsPrettier,

    additionalConfig,
    additionalDependencies
  })

  const scripts = {
    lint: 'eslint . --ext .vue,.js,.jsx,.cjs,.mjs --fix --ignore-path .gitignore'
  }

  if (needsPrettier) {
    scripts.format = 'prettier --write packages/'
  }

  // update package.json
  const packageJsonPath = path.resolve(rootDir, 'package.json')
  const existingPkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
  const updatedPkg = sortDependencies(deepMerge(deepMerge(existingPkg, pkg), { scripts }))
  fs.writeFileSync(packageJsonPath, JSON.stringify(updatedPkg, null, 2) + '\n', 'utf-8')

  // write to .eslintrc.cjs, pretterrc.json, etc
  for (const [fileName, content] of Object.entries(files)) {
    const fullPath = path.resolve(rootDir, fileName)
    fs.writeFileSync(fullPath, content, 'utf-8')
  }
}
