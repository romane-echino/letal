const { app, BrowserWindow, Menu, shell, ipcMain } = require('electron')
const path = require('path')
const fs = require('fs').promises
const { spawn, exec } = require('child_process')
const { autoUpdater } = require('electron-updater')

// Better development detection
const isDev = !app.isPackaged && process.env.NODE_ENV !== 'production'

// Configure auto-updater
autoUpdater.autoDownload = false
autoUpdater.autoInstallOnAppQuit = true

// Keep a global reference of the window object
let mainWindow

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 420,
    minHeight: 640,
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
    const distPath = path.join(__dirname, '../dist/index.html')
    console.log('Loading from:', distPath)
    mainWindow.loadFile(distPath)
    //mainWindow.webContents.openDevTools(); // Commenté pour la production
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

// Registry reading event handler
ipcMain.handle('read-registry', async (event, registryPath) => {
  return new Promise((resolve, reject) => {
    // Utiliser reg query pour lire le registre Windows
    const command = `reg query "${registryPath}" /s`
    
    exec(command, { encoding: 'utf8' }, (error, stdout, stderr) => {
      if (error) {
        console.error('Error reading registry:', error)
        console.error('stderr:', stderr)
        resolve({ success: false, error: error.message, data: null })
        return
      }
      
      try {
        // Parser la sortie du registre
        const registryData = parseRegistryOutput(stdout)
        resolve({ success: true, data: registryData, error: null })
      } catch (parseError) {
        console.error('Error parsing registry output:', parseError)
        resolve({ success: false, error: parseError.message, data: null })
      }
    })
  })
})

// Fonction pour parser la sortie du registre
function parseRegistryOutput(output) {
  const lines = output.split('\n').filter(line => line.trim())
  const result = {}
  let currentKey = null
  
  for (const line of lines) {
    const trimmedLine = line.trim()
    
    // Détecter une nouvelle clé de registre
    if (trimmedLine.startsWith('HKEY_')) {
      currentKey = trimmedLine
      result[currentKey] = {}
      continue
    }
    
    // Détecter une valeur de registre
    if (trimmedLine.includes('    ') && currentKey) {
      const parts = trimmedLine.split('    ')
      if (parts.length >= 2) {
        const valueName = parts[0].trim()
        const valueData = parts.slice(1).join('    ').trim()
        
        if (valueName && valueData) {
          result[currentKey][valueName] = valueData
        }
      }
    }
  }
  
  return result
}

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

// Auto-updater event handlers
ipcMain.handle('check-for-updates', async () => {
  try {
    if (isDev) {
      console.log('Skipping update check in development mode')
      return { available: false, message: 'Development mode - no updates checked' }
    }
    
    console.log('Checking for updates...')
    const result = await autoUpdater.checkForUpdates()
    return { available: !!result, message: 'Update check completed' }
  } catch (error) {
    console.error('Error checking for updates:', error)
    return { available: false, error: error.message }
  }
})

ipcMain.handle('download-update', async () => {
  try {
    console.log('Downloading update...')
    const result = await autoUpdater.downloadUpdate()
    return { success: true, message: 'Update downloaded successfully' }
  } catch (error) {
    console.error('Error downloading update:', error)
    return { success: false, error: error.message }
  }
})

ipcMain.handle('install-update', async () => {
  try {
    console.log('Installing update...')
    autoUpdater.quitAndInstall()
    return { success: true, message: 'Update installation initiated' }
  } catch (error) {
    console.error('Error installing update:', error)
    return { success: false, error: error.message }
  }
})

// Auto-updater event listeners
autoUpdater.on('checking-for-update', () => {
  console.log('Checking for update...')
  if (mainWindow) {
    mainWindow.webContents.send('update-status', { status: 'checking', message: 'Vérification des mises à jour...' })
  }
})

autoUpdater.on('update-available', (info) => {
  console.log('Update available:', info)
  if (mainWindow) {
    mainWindow.webContents.send('update-status', { 
      status: 'available', 
      message: 'Mise à jour disponible', 
      info 
    })
  }
})

autoUpdater.on('update-not-available', (info) => {
  console.log('Update not available:', info)
  if (mainWindow) {
    mainWindow.webContents.send('update-status', { 
      status: 'not-available', 
      message: 'Aucune mise à jour disponible', 
      info 
    })
  }
})

autoUpdater.on('error', (err) => {
  console.error('Auto-updater error:', err)
  if (mainWindow) {
    mainWindow.webContents.send('update-status', { 
      status: 'error', 
      message: 'Erreur lors de la vérification des mises à jour', 
      error: err.message 
    })
  }
})

autoUpdater.on('download-progress', (progressObj) => {
  console.log('Download progress:', progressObj)
  if (mainWindow) {
    mainWindow.webContents.send('update-status', { 
      status: 'downloading', 
      message: 'Téléchargement en cours...', 
      progress: progressObj 
    })
  }
})

autoUpdater.on('update-downloaded', (info) => {
  console.log('Update downloaded:', info)
  if (mainWindow) {
    mainWindow.webContents.send('update-status', { 
      status: 'downloaded', 
      message: 'Mise à jour téléchargée et prête à installer', 
      info 
    })
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

  // Initialize auto-updater (only in production)
  if (!isDev) {
    console.log('Initializing auto-updater...')
    // Check for updates on app start
    setTimeout(() => {
      autoUpdater.checkForUpdates()
    }, 3000) // Wait 3 seconds after app start
  }

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