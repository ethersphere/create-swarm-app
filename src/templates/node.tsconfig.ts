export function getNodeTsConfigTemplate() {
    return `{
    "$schema": "https://json.schemastore.org/tsconfig",
    "display": "Node 16",

    "compilerOptions": {
        "outDir": "dist",
        "lib": ["ES2022"],
        "module": "CommonJS",
        "target": "ES2022",
        "declaration": false,
        "strict": true,
        "skipLibCheck": true,
        "forceConsistentCasingInFileNames": true,
        "moduleResolution": "node",
        "esModuleInterop": true,
        "noImplicitAny": true,
        "strictNullChecks": true
    }
}
`
}
