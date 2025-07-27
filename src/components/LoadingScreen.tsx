import { Loader2, Gamepad2 } from 'lucide-react'

interface LoadingScreenProps {
  message?: string
  progress?: number
}

export default function LoadingScreen({ message = "Chargement des jeux...", progress }: LoadingScreenProps) {
  return (
    <div className="min-h-screen bg-primary flex items-center justify-center">
      <div className="text-center space-y-6">
        {/* Animated icon */}
        <div className="relative">
          <Gamepad2 className="w-16 h-16 text-accent mx-auto animate-bounce" />
          <Loader2 className="w-8 h-8 text-white/50 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-spin" />
        </div>

        {/* Loading message */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">{message}</h2>
          <p className="text-white/70">Détection des bibliothèques de jeux...</p>
        </div>

        {/* Progress bar */}
        {progress !== undefined && (
          <div className="w-64 mx-auto">
            <div className="bg-white/10 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-accent to-purple-500 h-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-white/50 text-sm mt-2">{Math.round(progress)}%</p>
          </div>
        )}

        {/* Animated dots */}
        <div className="flex justify-center space-x-1">
          <div className="w-2 h-2 bg-accent rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-accent rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-accent rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  )
} 