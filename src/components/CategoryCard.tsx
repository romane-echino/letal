import { PlayIcon } from '@heroicons/react/24/outline'

interface Category {
  id: number
  name: string
  count: number
  color: string
}

interface CategoryCardProps {
  category: Category
  index: number
}

export default function CategoryCard({ category, index }: CategoryCardProps) {
  return (
    <div 
      className="group relative bg-white/10 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/20 hover:border-purple-500/50 transition-all duration-500 hover:shadow-bloom-xl transform hover:scale-105"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="p-6">
        <div className={`w-12 h-12 bg-gradient-to-r ${category.color} rounded-xl flex items-center justify-center mb-4 animate-glow`}>
          <PlayIcon className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">{category.name}</h3>
        <p className="text-white/70 mb-4">{category.count} games available</p>
        <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 rounded-lg hover:shadow-bloom transition-all duration-300 transform hover:scale-105">
          Explore
        </button>
      </div>
    </div>
  )
} 