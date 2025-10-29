import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface WishlistItem {
  id: string
  name: string
  price: number
  image: string
  originalPrice?: number
}

interface WishlistStore {
  items: WishlistItem[]
  addItem: (item: WishlistItem) => void
  removeItem: (id: string) => void
  isInWishlist: (id: string) => boolean
  clearWishlist: () => void
  getTotalItems: () => number
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => {
        const existingItem = get().items.find(i => i.id === item.id)
        if (!existingItem) {
          set(state => ({
            items: [...state.items, item]
          }))
        }
      },
      
      removeItem: (id) => {
        set(state => ({
          items: state.items.filter(item => item.id !== id)
        }))
      },
      
      isInWishlist: (id) => {
        return get().items.some(item => item.id === id)
      },
      
      clearWishlist: () => {
        set({ items: [] })
      },
      
      getTotalItems: () => {
        return get().items.length
      }
    }),
    {
      name: 'wishlist-storage',
    }
  )
)