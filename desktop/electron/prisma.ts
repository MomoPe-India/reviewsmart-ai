import { app } from 'electron'
import { join } from 'path'
import * as fs from 'fs'

// Load environment variables if not yet populated
try {
  const envPaths = [
    join(app.getAppPath(), '.env'),
    join(process.cwd(), '.env'),
    join(__dirname, '../../.env'),
  ]
  for (const envPath of envPaths) {
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf-8')
      content.split('\n').forEach((line) => {
        const match = line.match(/^([^#=]+)=(.*)$/)
        if (match) {
          const key = match[1].trim()
          const val = match[2].trim().replace(/^['"](.*)['"]$/, '$1')
          if (!process.env[key]) {
            process.env[key] = val
          }
        }
      })
      break
    }
  }
} catch {
  // Use existing process.env
}

// Locate Prisma Query Engine dynamically from app root
try {
  let enginePath: string | undefined
  const appPath = app.getAppPath()

  if (process.platform === 'darwin') {
    const fileName =
      process.arch === 'arm64'
        ? 'libquery_engine-darwin-arm64.dylib.node'
        : 'libquery_engine-darwin.dylib.node'

    const candidates = [
      join(appPath, 'prisma/generated-client', fileName),
      join(process.resourcesPath, 'app/prisma/generated-client', fileName),
      join(__dirname, '../../prisma/generated-client', fileName),
    ]

    for (const c of candidates) {
      if (fs.existsSync(c)) {
        enginePath = c
        break
      }
    }
  } else if (process.platform === 'win32') {
    const fileName = 'query_engine-windows.dll.node'
    const candidates = [
      join(appPath, 'prisma/generated-client', fileName),
      join(process.resourcesPath, 'app/prisma/generated-client', fileName),
      join(__dirname, '../../prisma/generated-client', fileName),
    ]

    for (const c of candidates) {
      if (fs.existsSync(c)) {
        enginePath = c
        break
      }
    }
  }

  if (enginePath) {
    process.env.PRISMA_QUERY_ENGINE_LIBRARY = enginePath
  }
} catch {
  // Use default engine resolution
}

// Load Prisma client from dynamic absolute path
const clientPath = join(app.getAppPath(), 'prisma/generated-client')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const PrismaClientPkg = require(clientPath)
const PrismaClientClass = PrismaClientPkg.PrismaClient || PrismaClientPkg

export const prisma = new PrismaClientClass()
