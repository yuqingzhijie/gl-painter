// config/rollup.base.js
import commonjs from '@rollup/plugin-commonjs'
import nodeResolve from '@rollup/plugin-node-resolve'
import terser from '@rollup/plugin-terser'
import typescript from '@rollup/plugin-typescript'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import del from 'rollup-plugin-delete'
import dts from 'rollup-plugin-dts'

function getPackageName(pkgDir) {
  const pkg = JSON.parse(
    readFileSync(path.join(pkgDir, 'package.json'), 'utf-8'),
  )
  return (pkg.name || path.basename(pkgDir)).split('/').pop()
}

export function createRollupConfig({ pkgDir, formatList, iifeName }) {
  const packageName = getPackageName(pkgDir)
  const input = `${pkgDir}/src/index.ts`

  function config1() {
    const output = []
    formatList = formatList || ['esm', 'cjs', 'iife']
    formatList.forEach((format) => {
      const item = {
        file: path.join(pkgDir, 'dist', `${packageName}.${format}.js`),
        format: format,
      }
      if (format === 'iife') {
        item.name = iifeName
      }
      output.push(item)
    })

    return {
      input,
      output,
      plugins: [
        nodeResolve(),
        commonjs(),
        typescript({
          outputToFilesystem: false,
        }),
        process.env.NODE_ENV === 'production' && terser(),
      ].filter(Boolean),
    }
  }

  function config2() {
    return {
      input: path.join(pkgDir, 'dist/types/index.d.ts'),
      output: {
        file: path.join(pkgDir, 'dist', `${packageName}.d.ts`),
        format: 'es',
      },
      plugins: [
        dts({
          tsconfig: path.join(pkgDir, 'tsconfig.json'),
          compilerOptions: {
            preserveSymlinks: false, // 确保路径解析与 monorepo 结构一致
            paths: {
              '@painter/gl-math': '../packages/gl-math',
            },
          },
        }),
        del({ hook: 'buildEnd', targets: './dist/types' }),
      ],
    }
  }

  return () => [config1(), config2()]
}
