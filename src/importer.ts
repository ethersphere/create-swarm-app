import { CodeType } from './types'

export function makeImport(codeType: CodeType, imports: string[], location: string) {
    return codeType === 'commonjs'
        ? `const { ${imports.join(', ')} } = require('${location}')`
        : `import { ${imports.join(', ')} } from '${location}${
              location.startsWith('.') && codeType === 'esmodules' ? '.js' : ''
          }'`
}
