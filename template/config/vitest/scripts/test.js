import { execa } from 'execa'

const execaArgs = ['--config', 'vitest.config.js']

// eslint-disable-next-line no-undef
const arg = process.argv.slice(2)

const options = {
  command: 'vitest',
  order: 'dev'
}

function run() {
  if (arg && arg.length !== 0) {
    execa(options.command, [options.order, `packages/${arg[0]}`, ...execaArgs], {
      stdio: 'inherit'
    })
  } else {
    throw new Error('no business project name')
  }
}

run()
