import { commandRunner } from './utils.js'

// eslint-disable-next-line no-undef
const args = process.argv.slice(2)

const commandOptions = {
  command: 'vite',
  order: 'serve',
}

commandRunner(args, commandOptions)
