const { contextBridge, ipcRenderer } = require('electron')

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Add any API methods you want to expose to the renderer process
  platform: process.platform,
  versions: process.versions,
  
  // Window controls
  minimize: () => ipcRenderer.send('window-minimize'),
  maximize: () => ipcRenderer.send('window-maximize'),
  close: () => ipcRenderer.send('window-close'),
  toggleDevTools: () => ipcRenderer.send('window-toggle-devtools'),
  
  // Window drag
  startDrag: () => ipcRenderer.send('window-start-drag'),
  
  // File system operations
  checkPathExists: (path) => ipcRenderer.invoke('fs-exists', path),
  readFile: (path) => ipcRenderer.invoke('fs-read-file', path),
  readDirectory: (path) => ipcRenderer.invoke('fs-read-dir', path),
  
  // Application launching
  launchApp: (path) => ipcRenderer.invoke('launch-app', path),
  
  // Auto-updater functions
  checkForUpdates: () => ipcRenderer.invoke('check-for-updates'),
  downloadUpdate: () => ipcRenderer.invoke('download-update'),
  installUpdate: () => ipcRenderer.invoke('install-update'),
  onUpdateStatus: (callback) => ipcRenderer.on('update-status', callback),
  
  // Example: Send a message to the main process
  sendMessage: (message) => ipcRenderer.send('message', message),
  
  // Example: Receive a message from the main process
  onMessage: (callback) => ipcRenderer.on('message', callback),
  
  // Example: Get app version
  getAppVersion: () => process.env.npm_package_version || '1.0.0'
}) 