import { makeImport } from '../importer'
import { CodeType } from '../types'

export function getIndexTsTemplate(beeInit: string, codeType: CodeType) {
    return `${makeImport(codeType, ['Bee'], '@ethersphere/bee-js')}
${makeImport(codeType, ['BEE_HOST'], './config')}

main()

async function main() {
    const bee = ${beeInit}
    const batchId = await getOrCreatePostageBatch(bee)
    console.log('Batch ID', batchId.toString())
    const data = 'Hello, world! The current time is ' + new Date().toLocaleString()
    const uploadResult = await bee.uploadData(batchId, data)
    console.log('Swarm hash', uploadResult.reference.toHex())
    const downloadResult = await bee.downloadData(uploadResult.reference)
    console.log('Downloaded data:', downloadResult.toUtf8())
}

async function getOrCreatePostageBatch(${codeType === 'typescript' ? 'bee: Bee' : 'bee'}) {
    const batches = await bee.getPostageBatches()
    const usable = batches.find(x => x.usable)
  
    if (usable) {
        return usable.batchID
    } else {
        return bee.createPostageBatch('500000000', 20)
    }
}
`
}
