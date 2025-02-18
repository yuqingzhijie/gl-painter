import { glob } from 'glob'
import { rimraf } from 'rimraf'

async function clean() {
  try {
    const files = await glob('packages/*/dist', { ignore: 'node_modules/**' })

    await Promise.all(files.map((file) => rimraf(file)))
  } catch (err) {
    console.error('Error during clean operation:', err)
  }
}

clean()
