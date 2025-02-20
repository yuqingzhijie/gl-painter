import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRollupConfig } from '../../config/rollup.base.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default createRollupConfig({
  pkgDir: __dirname,
  iifeName: 'glCanvas',
})
