interface ElectronAPI {
  platform: string
  versions: NodeJS.ProcessVersions
  
  // Window controls
  minimize: () => void
  maximize: () => void
  close: () => void
  toggleDevTools: () => void
  
  // Window drag
  startDrag: () => void
  
  // File system operations
  checkPathExists: (path: string) => Promise<boolean>
  readFile: (path: string) => Promise<string | null>
  readDirectory: (path: string) => Promise<string[]>
  
  // Registry operations
  readRegistry: (registryPath: string) => Promise<{ success: boolean; data: any; error: string | null }>
  
  // Application launching
  launchApp: (path: string) => Promise<{ success: boolean; message: string; error?: string }>
  
  // Auto-updater functions
  checkForUpdates: () => Promise<{ available: boolean; message: string; error?: string }>
  downloadUpdate: () => Promise<{ success: boolean; message: string; error?: string }>
  installUpdate: () => Promise<{ success: boolean; message: string; error?: string }>
  onUpdateStatus: (callback: (event: any, status: any) => void) => void
  
  // Example functions
  sendMessage: (message: string) => void
  onMessage: (callback: (event: any, message: any) => void) => void
  getAppVersion: () => string
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}

export {} 