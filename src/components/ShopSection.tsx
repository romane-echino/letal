import { useState } from 'react'
import CategoryCard from './CategoryCard'

interface Category {
  id: number
  name: string
  count: number
  color: string
}

export default function ShopSection() {
  const [categories] = useState<Category[]>([
    {
      id: 1,
      name: 'Action',
      count: 45,
      color: 'from-red-500 to-pink-500'
    },
    {
      id: 2,
      name: 'RPG',
      count: 32,
      color: 'from-purple-500 to-indigo-500'
    },
    {
      id: 3,
      name: 'Stratégie',
      count: 28,
      color: 'from-green-500 to-teal-500'
    },
    {
      id: 4,
      name: 'Sports',
      count: 15,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 5,
      name: 'Aventure',
      count: 38,
      color: 'from-yellow-500 to-orange-500'
    },
    {
      id: 6,
      name: 'Simulation',
      count: 22,
      color: 'from-gray-500 to-slate-500'
    }
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Catégories de jeux</h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category, index) => (
          <CategoryCard key={category.id} category={category} index={index} />
        ))}
      </div>
    </div>
  )
} 