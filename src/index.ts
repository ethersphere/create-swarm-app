#!/usr/bin/env node

import { Arrays, Strings } from 'cafe-utility'
import { existsSync, mkdirSync, writeFileSync } from 'fs'
import { exit } from 'process'
import {
    BEE_JS_VERSION,
    REACT_DOM_VERSION,
    REACT_VERSION,
    TSX_VERSION,
    TYPES_NODE_VERSION,
    TYPES_REACT_DOM_VERSION,
    TYPES_REACT_VERSION,
    TYPESCRIPT_VERSION,
    VITE_VERSION
} from './dependency.js'
import { getAppTsxTemplate } from './templates/app.tsx'
import { getIndexHtmlTemplate } from './templates/index.html.js'
import { getIndexTsTemplate } from './templates/index.ts.js'
import { getIndexTsxTemplate } from './templates/index.tsx.js'
import { getNodeTsConfigTemplate } from './templates/node.tsconfig.js'
import { getViteTsConfigTemplate } from './templates/vite.tsconfig.js'
import { CodeType, ProjectType } from './types'

main(
    process.argv[2],
    process.argv[3],
    Arrays.getArgument(process.argv, 'host'),
    Arrays.getArgument(process.argv, 'auth')
)

async function main(projectName: string, type: string, host?: string | null, auth?: string | null) {
    if (!projectName || !type) {
        console.error('Usage:   npm init swarm-app <name> <type>')
        console.error('Example: npm init swarm-app my-app node-ts')
        console.error('')
        console.error('Possible types: node, node-esm, node-ts, vite-tsx')
        console.error('')
        console.error('Optional flags:')
        console.error('--host <url> Bee node URL')
        console.error('--auth <key> Bee node API key')
        exit(1)
    }
    if (!['node', 'node-esm', 'node-ts', 'vite-tsx'].includes(type)) {
        console.error('Possible types: node, node-esm, node-ts, vite-tsx')
        exit(1)
    }
    const codeType: CodeType =
        type.endsWith('ts') || type.endsWith('tsx') ? 'typescript' : type.endsWith('esm') ? 'esmodules' : 'commonjs'
    const projectType: ProjectType = type.startsWith('node') ? 'node' : 'vite'

    if (existsSync(projectName)) {
        console.error('Project already exists')
        exit(1)
    }
    mkdirSync(projectName)
    mkdirSync(projectName + '/src')
    const packageJson: any = {
        name: Strings.slugify(projectName),
        version: '1.0.0',
        scripts: {},
        license: 'ISC',
        dependencies: { '@ethersphere/bee-js': BEE_JS_VERSION },
        devDependencies: {}
    }
    if (codeType === 'typescript') {
        packageJson.devDependencies.typescript = TYPESCRIPT_VERSION
    }
    if (projectType === 'vite') {
        packageJson.dependencies.react = REACT_VERSION
        packageJson.dependencies['react-dom'] = REACT_DOM_VERSION
        packageJson.devDependencies['@types/react'] = TYPES_REACT_VERSION
        packageJson.devDependencies['@types/react-dom'] = TYPES_REACT_DOM_VERSION
    }
    if (codeType === 'esmodules') {
        packageJson.type = 'module'
    }
    if (projectType === 'vite') {
        packageJson.devDependencies['vite'] = VITE_VERSION
        packageJson.scripts.start = 'vite'
        packageJson.scripts.build = 'vite build --base=./'
        packageJson.scripts.check = 'tsc --noEmit'
    }
    if (projectType === 'node' && codeType === 'typescript') {
        packageJson.devDependencies['tsx'] = TSX_VERSION
        packageJson.devDependencies['@types/node'] = TYPES_NODE_VERSION
        packageJson.scripts.start = 'tsx src'
        packageJson.scripts.build = 'tsc'
        packageJson.scripts.check = 'tsc --noEmit'
    }
    if (projectType === 'node' && codeType === 'commonjs') {
        packageJson.scripts.start = 'node src'
    }
    if (projectType === 'node' && codeType === 'esmodules') {
        packageJson.scripts.start = 'node --experimental-specifier-resolution=node src'
    }

    const beeHost = host ?? 'http://localhost:1633'
    const beeInit = auth ? `new Bee(BEE_HOST, { headers: { Authorization: '${auth}' } })` : `new Bee(BEE_HOST)`

    const config =
        codeType === 'commonjs'
            ? `module.exports = { BEE_HOST: '${beeHost}' }\n`
            : `export const BEE_HOST = '${beeHost}'\n`

    const appTsx = getAppTsxTemplate(beeInit)
    const indexTsx = getIndexTsxTemplate()
    const indexHtml = getIndexHtmlTemplate()
    const viteTsConfig = getViteTsConfigTemplate()
    const nodeTsConfig = getNodeTsConfigTemplate()
    const indexTs = getIndexTsTemplate(beeInit, codeType)

    writeFileSync(`${projectName}/package.json`, JSON.stringify(packageJson, null, 4))
    if (projectType === 'vite') {
        writeFileSync(`${projectName}/src/App.tsx`, appTsx)
        writeFileSync(`${projectName}/src/index.tsx`, indexTsx)
        writeFileSync(`${projectName}/src/config.ts`, config)
        writeFileSync(`${projectName}/tsconfig.json`, viteTsConfig)
        writeFileSync(`${projectName}/index.html`, indexHtml)
    }
    if (projectType === 'node') {
        if (codeType === 'typescript') {
            writeFileSync(`${projectName}/tsconfig.json`, nodeTsConfig)
            writeFileSync(`${projectName}/src/index.ts`, indexTs)
            writeFileSync(`${projectName}/src/config.ts`, config)
        } else {
            writeFileSync(`${projectName}/src/index.js`, indexTs)
            writeFileSync(`${projectName}/src/config.js`, config)
        }
    }
    console.log('Project created')
    console.log('')
    console.log('cd ' + projectName)
    console.log('npm install')
    console.log('npm start')
}
