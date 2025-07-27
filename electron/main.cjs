const { app, BrowserWindow, Menu, shell, ipcMain } = require('electron')
const path = require('path')
const fs = require('fs').promises
const { spawn } = require('child_process')

// Better development detection
const isDev = !app.isPackaged && process.env.NODE_ENV !== 'production'

// Keep a global reference of the window object
let mainWindow

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.cjs')
    },
    icon: path.join(__dirname, 'assets/icon.png'),
    show: false,
    titleBarStyle: 'hidden',
    titleBarOverlay: false,
    frame: false,
    backgroundColor: '#1a1a2e',
    title: 'GameHub',
    // Supprimer les boutons de la fenêtre
    titleBarStyle: 'hidden',
    // Rendre la fenêtre redimensionnable mais sans bordures
    resizable: true,
    // Supprimer la barre de titre
    autoHideMenuBar: true,
    // Permettre le redimensionnement depuis les bords
    webSecurity: true,
    // Désactiver les raccourcis clavier par défaut
    enableMenuBar: false
  })

  // Load the app
  if (isDev) {
    console.log('Development mode detected, loading from Vite dev server...')
    mainWindow.loadURL('http://localhost:5173')
    // Open DevTools in development
    mainWindow.webContents.openDevTools()
  } else {
    console.log('Production mode detected, loading from dist...')
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
    mainWindow.webContents.openDevTools();
  }

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null
  })

  // Handle external links
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })
}

// Window control event handlers
ipcMain.on('window-minimize', () => {
  if (mainWindow) {
    mainWindow.minimize()
  }
})

ipcMain.on('window-maximize', () => {
  if (mainWindow) {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize()
    } else {
      mainWindow.maximize()
    }
  }
})

ipcMain.on('window-close', () => {
  if (mainWindow) {
    mainWindow.close()
  }
})

ipcMain.on('window-toggle-devtools', () => {
  if (mainWindow) {
    mainWindow.webContents.toggleDevTools()
  }
})

ipcMain.on('window-start-drag', () => {
  if (mainWindow) {
    mainWindow.webContents.sendInputEvent({
      type: 'mouseDown',
      x: 0,
      y: 0,
      button: 'left',
      clickCount: 1
    })
  }
})

// File system event handlers
ipcMain.handle('fs-exists', async (event, filePath) => {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
})

ipcMain.handle('fs-read-file', async (event, filePath) => {
  try {
    return await fs.readFile(filePath, 'utf8')
  } catch (error) {
    console.error('Error reading file:', error)
    return null
  }
})

ipcMain.handle('fs-read-dir', async (event, dirPath) => {
  try {
    const files = await fs.readdir(dirPath)
    return files
  } catch (error) {
    console.error('Error reading directory:', error)
    return []
  }
})

// Application launching event handler
ipcMain.handle('launch-app', async (event, appPath) => {
  try {
    console.log('Launching application:', appPath)
    
    // Handle different types of paths
    if (appPath.startsWith('steam://')) {
      // Launch Steam protocol URL
      shell.openExternal(appPath)
      return { success: true, message: 'Steam protocol launched' }
    } else if (appPath.endsWith('.exe')) {
      // Launch executable directly
      spawn(appPath, [], { detached: true })
      return { success: true, message: 'Application launched' }
    } else {
      // Try to open with default application
      shell.openPath(appPath)
      return { success: true, message: 'Path opened with default application' }
    }
  } catch (error) {
    console.error('Error launching application:', error)
    return { success: false, error: error.message }
  }
})

// Supprimer complètement le menu
const template = []

// This method will be called when Electron has finished initialization
app.whenReady().then(() => {
  console.log('Electron app starting...')
  console.log('isDev:', isDev)
  console.log('isPackaged:', app.isPackaged)
  console.log('NODE_ENV:', process.env.NODE_ENV)
  
  createWindow()

  // Supprimer le menu complètement
  Menu.setApplicationMenu(null)

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

// Security: Prevent new window creation
app.on('web-contents-created', (event, contents) => {
  contents.on('new-window', (event, navigationUrl) => {
    event.preventDefault()
    shell.openExternal(navigationUrl)
  })
}) 