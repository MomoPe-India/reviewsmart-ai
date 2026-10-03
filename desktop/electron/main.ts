import { app, shell, BrowserWindow, ipcMain, nativeTheme } from 'electron'
import { join } from 'path'
import { registerMerchantHandlers } from './ipc/merchants'
import { registerAgentHandlers } from './ipc/agents'
import { registerPaymentHandlers } from './ipc/payments'
import { registerSettingsHandlers } from './ipc/settings'
import { registerDashboardHandlers } from './ipc/dashboard'

const isDev = !app.isPackaged

// Set env vars from .env file in dev
if (isDev) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const dotenv = require('dotenv')
    dotenv.config({ path: join(__dirname, '../../.env') })
  } catch {
    // env vars set externally or bundled
  }
}



let mainWindow: BrowserWindow | null = null

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 1100,
    minHeight: 680,
    show: false,
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
    trafficLightPosition: { x: 16, y: 16 },
    backgroundColor: '#0f172a',
    autoHideMenuBar: process.platform !== 'darwin',
    ...(process.platform === 'linux' ? { icon: join(__dirname, '../../resources/icon.png') } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/preload.js'),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false,
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow!.show()
    if (isDev) mainWindow!.webContents.openDevTools({ mode: 'detach' })
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (isDev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  if (process.platform === 'win32') {
    app.setAppUserModelId('com.reviewsmart.admin')
  }

  // Force dark mode
  nativeTheme.themeSource = 'dark'

  // Register all IPC handlers
  registerMerchantHandlers(ipcMain)
  registerAgentHandlers(ipcMain)
  registerPaymentHandlers(ipcMain)
  registerSettingsHandlers(ipcMain)
  registerDashboardHandlers(ipcMain)

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
