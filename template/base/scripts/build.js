import { commandRunner } from './utils.js'

// eslint-disable-next-line no-undef
const args = process.argv.slice(2)

let mode = ''
args.forEach((arg, index) => {
  const match = arg.match(/^--mode=(.*)$/)
  if (match) {
    mode = match[1]
    args.splice(index, 1)
  }
})

const commandOptions = {
  command: 'vite',
  order: 'build',
  mode: mode ? mode : 'production',
}

commandRunner(args, commandOptions)
