import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'

export type SortOption = 'name' | 'lastPlayed' | 'size' | 'recent' | 'favorites'

interface SortOptionsProps {
  currentSort: SortOption
  onSortChange: (sort: SortOption) => void
}

export default function SortOptions({ currentSort, onSortChange }: SortOptionsProps) {
  const [isOpen, setIsOpen] = useState(false)

  const sortOptions = [
    { value: 'name', label: 'Alphabétique' },
    { value: 'size', label: 'Taille' },
    { value: 'recent', label: 'Récents' },
    { value: 'favorites', label: 'Favoris' }
  ] as const

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-xl rounded-lg text-white hover:bg-white/20 transition-all duration-200 cursor-pointer"
      >
        <span>Trier par: {sortOptions.find(opt => opt.value === currentSort)?.label}</span>
        <ChevronDownIcon className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-48 bg-white/10 backdrop-blur-xl rounded-lg border border-white/20 shadow-xl z-50">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onSortChange(option.value)
                setIsOpen(false)
              }}
              className={`w-full px-4 py-2 text-left text-white hover:bg-white/20 transition-colors duration-200 ${
                currentSort === option.value ? 'bg-accent/20' : ''
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}

      {/* Overlay to close dropdown when clicking outside */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
} 