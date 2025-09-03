export function getAppTsxTemplate(beeInit: string) {
    return `import { BatchId, Bee, Size, Duration } from '@ethersphere/bee-js'
import { useState } from 'react'
import { BEE_HOST } from './config'

export function App() {
    const [batchId, setBatchId] = useState<BatchId | null>(null)
    const [file, setFile] = useState<File | null>(null)
    const [fileList, setFileList] = useState<FileList | null>(null)
    const [swarmHash, setSwarmHash] = useState<string | null>(null)

    const bee = ${beeInit}

    async function getOrCreatePostageBatch() {
        const batches = await bee.getPostageBatches()
        const usable = batches.find(x => x.usable)

        if (usable) {
            setBatchId(usable.batchID)
        } else {
            setBatchId(await bee.buyStorage(Size.fromGigabytes(1), Duration.fromDays(1)))
        }
    }

    async function uploadFile() {
        if (!batchId) {
            return
        }
        const result = await bee.uploadFile(batchId, file)
        setSwarmHash(result.reference.toHex())
        setFile(null)
    }

    async function uploadDirectory() {
        if (!batchId || !fileList) {
            return
        }
        const result = await bee.uploadFiles(batchId, fileList)
        setSwarmHash(result.reference.toHex())
        setFileList(null)
    }

    const directoryInputAttributes = {
        webkitdirectory: '',
        directory: '',
        multiple: true
    }

    return (
        <div>
            {!batchId && <button onClick={getOrCreatePostageBatch}>Get or create postage batch</button>}
            {batchId && <p>Batch ID: {batchId.toHex()}</p>}
            {batchId && !swarmHash && (
                <div>
                    <p>Single file upload</p>
                    <input type="file" onChange={e => setFile(e.target.files![0])} />
                    <button onClick={uploadFile}>Upload file</button>

                    <p>Directory upload</p>
                    <input type="file" onChange={e => setFileList(e.target.files)} {...directoryInputAttributes} />
                    <button onClick={uploadDirectory}>Upload directory</button>
                </div>
            )}
            {swarmHash && <a href={BEE_HOST + '/bzz/' + swarmHash}>Swarm hash: {swarmHash}</a>}
        </div>
    )
}
`
}
