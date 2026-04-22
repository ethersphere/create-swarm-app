# create-swarm-app

Scaffold a new [Swarm](https://ethswarm.org) decentralized storage app in seconds — like `create-react-app`, but for dapps.

## Usage

```bash
npm init swarm-app --name <project-name> --type <template>
```

**Example:**

```bash
npm init swarm-app --name my-app --type node-ts
```

This creates a `my-app/` directory with a working starter project. Then:

```bash
cd my-app
npm install
npm start
```

## Templates

| Type       | Language                | Runtime        | Best for                          |
| ---------- | ----------------------- | -------------- | --------------------------------- |
| `node`     | JavaScript (CommonJS)   | Node.js        | Simple scripts, quick experiments |
| `node-esm` | JavaScript (ES Modules) | Node.js        | Modern JS with `import`/`export`  |
| `node-ts`  | TypeScript              | Node.js        | Type-safe backend scripts         |
| `vite-tsx` | TypeScript + React      | Browser (Vite) | Web UIs for Swarm storage         |

## What the generated app does

Every template comes with working example code that demonstrates the core Swarm workflow:

**Node templates** (`node`, `node-esm`, `node-ts`) generate a script that:

1. Connects to your local Bee node
2. Finds an existing usable postage batch, or buys new storage if none exists
3. Uploads a text string to Swarm
4. Downloads it back and prints the result along with the Swarm content hash

**Vite template** (`vite-tsx`) generates a React web app that:

1. Gets or creates a postage batch via a button click
2. Uploads a single file to Swarm
3. Uploads a directory of files to Swarm
4. Shows the resulting Swarm hash as a clickable link via the Bee gateway

## Options

| Flag     | Default                 | Description                         |
| -------- | ----------------------- | ----------------------------------- |
| `--name` | _(required)_            | Project directory name              |
| `--type` | _(required)_            | Template type (see above)           |
| `--host` | `http://localhost:1633` | URL of your Bee node                |
| `--auth` | _(none)_                | API key for authenticated Bee nodes |

**Custom Bee host example:**

```bash
npm init swarm-app --name my-app --type vite-tsx --host http://my-bee-node:1633
```

## Generated project structure

**Node template:**

```
my-app/
├── src/
│   ├── index.ts      # Main script — upload/download example
│   └── config.ts     # Bee node URL and client setup
├── package.json
└── tsconfig.json     # (node-ts only)
```

**Vite template:**

```
my-app/
├── src/
│   ├── App.tsx       # React component with upload UI
│   ├── index.tsx     # React entry point
│   └── config.ts     # Bee node URL and client setup
├── index.html
├── package.json
└── tsconfig.json
```

## About bee-js

Generated projects use [bee-js](https://github.com/ethersphere/bee-js), the official JavaScript/TypeScript client for Swarm. The key concepts demonstrated in the templates:

-   **Postage batches** — you pay for storage on Swarm by buying a postage batch. The templates handle finding an existing usable batch or purchasing one automatically.
-   **Upload** — `bee.uploadData()` / `bee.uploadFile()` / `bee.uploadFiles()` store content and return a content-addressed hash.
-   **Download** — `bee.downloadData(reference)` retrieves content by its hash.

## Further reading

-   [Swarm documentation](https://docs.ethswarm.org)
-   [bee-js documentation](https://bee-js.ethswarm.org)
-   [Bee node quick start](https://docs.ethswarm.org/docs/bee/installation/quick-start)
