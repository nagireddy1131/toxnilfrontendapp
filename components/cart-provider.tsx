"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import api from "@/lib/api"

export type CartItem = {
    id: string
    name: string
    price: number
    image?: string
    category?: string
    quantity: number
    // For backend compatibility, store product ID as 'product' too if needed, 
    // but 'id' is standard in frontend. We'll map it when sending.
    product?: string
}

type CartContextType = {
    items: CartItem[]
    addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void
    removeItem: (id: string) => void
    updateQuantity: (id: string, quantity: number) => void
    clearCart: () => void
    cartCount: number
    subtotal: number
    syncCart: () => Promise<boolean>
    uploadCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([])
    const [isInitialized, setIsInitialized] = useState(false)

    // Helper to get user info
    const getUserInfo = () => {
        if (typeof window === "undefined") return null
        const userInfo = localStorage.getItem("userInfo")
        return userInfo ? JSON.parse(userInfo) : null
    }

    // Function to sync cart from server (or local if no user)
    const syncCart = useCallback(async (): Promise<boolean> => {
        const userInfo = getUserInfo()

        if (userInfo && userInfo.token) {
            try {
                // Fetch user profile which contains cart
                const config = {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                }
                const { data } = await api.get('/users/profile', config)

                if (data.cartItems && Array.isArray(data.cartItems)) {
                    // Map backend items to frontend items
                    const mappedItems = data.cartItems.map((item: any) => ({
                        id: item.product,
                        product: item.product,
                        name: item.name,
                        price: item.price,
                        image: item.image,
                        quantity: item.qty,
                        category: item.category
                    }))
                    setItems(mappedItems)
                    return true
                }
                return true
            } catch (error) {
                console.error("Failed to fetch server cart", error)
                return false
            }
        } else {
            // Fallback to local storage
            const savedCart = localStorage.getItem("toxnil-cart")
            if (savedCart) {
                try {
                    setItems(JSON.parse(savedCart))
                } catch (error) {
                    console.error("Failed to parse cart data:", error)
                }
            }
            return true
        }
    }, [])

    const uploadCart = useCallback(async () => {
        const userInfo = getUserInfo()
        if (userInfo && userInfo.token) {
            const cartPayload = items.map(item => ({
                product: item.id,
                name: item.name,
                qty: item.quantity,
                image: item.image,
                price: item.price,
                category: item.category
            }))

            try {
                await api.put('/users/cart', { cartItems: cartPayload }, {
                    headers: { Authorization: `Bearer ${userInfo.token}` }
                })
            } catch (err) {
                console.error("Failed to upload cart", err)
            }
        }
    }, [items])

    // Initial load
    useEffect(() => {
        let mounted = true
        syncCart().then((success) => {
            if (mounted && success) {
                setIsInitialized(true)
            }
        })
        return () => { mounted = false }
    }, [syncCart])

    // Save cart to server and localStorage on change
    useEffect(() => {
        if (!isInitialized) return

        // 1. Save to local storage
        localStorage.setItem("toxnil-cart", JSON.stringify(items))

        // 2. Save to server if logged in
        const userInfo = getUserInfo()
        if (userInfo && userInfo.token) {
            const cartPayload = items.map(item => ({
                product: item.id, // ID is the product ID
                name: item.name,
                qty: item.quantity,
                image: item.image,
                price: item.price,
                category: item.category
            }))

            // Use a timeout to debounce slightly effectively, or just fire
            api.put('/users/cart', { cartItems: cartPayload }, {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            }).catch(err => console.error("Failed to save cart to server", err))
        }
    }, [items, isInitialized])

    const addItem = (newItem: Omit<CartItem, "quantity"> & { quantity?: number }) => {
        const qtyToAdd = newItem.quantity || 1
        setItems((currentItems) => {
            const existingItem = currentItems.find((item) => item.id === newItem.id)
            if (existingItem) {
                return currentItems.map((item) =>
                    // Update price and other details even if item exists to handle price changes
                    item.id === newItem.id ? {
                        ...item,
                        ...newItem,
                        quantity: item.quantity + qtyToAdd
                    } : item,
                )
            }
            return [...currentItems, { ...newItem, quantity: qtyToAdd }]
        })
    }

    const removeItem = (id: string) => {
        setItems((currentItems) => currentItems.filter((item) => item.id !== id))
    }

    const updateQuantity = (id: string, quantity: number) => {
        if (quantity < 1) return
        setItems((currentItems) =>
            currentItems.map((item) => (item.id === id ? { ...item, quantity } : item)),
        )
    }

    const clearCart = () => {
        setItems([])
    }

    const cartCount = items.reduce((sum, item) => sum + item.quantity, 0)
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

    return (
        <CartContext.Provider
            value={{
                items,
                addItem,
                removeItem,
                updateQuantity,
                clearCart,
                cartCount,
                subtotal,
                syncCart,
                uploadCart
            }}
        >
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const context = useContext(CartContext)
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider")
    }
    return context
}
