import { useState, useEffect } from 'react'

const FAVORITES_KEY = 'letal-favorites'

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([])

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const savedFavorites = localStorage.getItem(FAVORITES_KEY)
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites))
      }
    } catch (error) {
      console.error('Error loading favorites:', error)
    }
  }, [])

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
    } catch (error) {
      console.error('Error saving favorites:', error)
    }
  }, [favorites])

  const toggleFavorite = (gameId: string) => {
    setFavorites(prev => {
      if (prev.includes(gameId)) {
        return prev.filter(id => id !== gameId)
      } else {
        return [...prev, gameId]
      }
    })
  }

  const isFavorite = (gameId: string) => {
    return favorites.includes(gameId)
  }

  const addFavorite = (gameId: string) => {
    if (!favorites.includes(gameId)) {
      setFavorites(prev => [...prev, gameId])
    }
  }

  const removeFavorite = (gameId: string) => {
    setFavorites(prev => prev.filter(id => id !== gameId))
  }

  const clearFavorites = () => {
    setFavorites([])
  }

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    addFavorite,
    removeFavorite,
    clearFavorites
  }
} 