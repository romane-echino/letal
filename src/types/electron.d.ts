declare global {
  interface Window {
    electronAPI: {
      platform: string
      versions: NodeJS.ProcessVersions
      minimize: () => void
      maximize: () => void
      close: () => void
      toggleDevTools: () => void
      startDrag: () => void
      checkPathExists: (path: string) => Promise<boolean>
      readFile: (path: string) => Promise<string | null>
      readDirectory: (path: string) => Promise<string[]>
      launchApp: (path: string) => Promise<{ success: boolean; message?: string; error?: string }>
      sendMessage: (message: string) => void
      onMessage: (callback: (event: any, message: any) => void) => void
      getAppVersion: () => string
    }
  }
}

export {} 