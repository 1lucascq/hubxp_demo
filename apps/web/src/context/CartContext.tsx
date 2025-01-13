import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CreateOrder, Product } from '../types';
import { useCreateOrder } from '../hooks/useOrders.tsx';

interface CartItem extends Product {
    quantity: number;
}

interface CartContextData {
    cart: CartItem[];
    totalValue: number;
    addToCart: (product: Product) => void;
    removeFromCart: (productId: string) => void;
    increaseQuantity: (productId: string) => void;
    decreaseQuantity: (productId: string) => void;
    placeOrder: () => void;
    isCartOpen: boolean;
    setIsCartOpen: (isOpen: boolean) => void;
    isLoading: boolean;
	setIsLoading: (isLoading: boolean) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: { children: ReactNode }) {
    const [isLoading, setIsLoading] = useState(false);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [totalValue, setTotalValue] = useState(0);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const { mutate: createOrder } = useCreateOrder();

    const calculateTotal = (items: CartItem[]) => {
        return items.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const addToCart = (product: Product) => {
        setCart((currentCart) => {
            const existingItem = currentCart.find((item) => item._id === product._id);
            if (existingItem) {
                const updatedCart = currentCart.map((item) =>
                    item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item,
                );
                setTotalValue(calculateTotal(updatedCart));
                return updatedCart;
            }
            const updatedCart = [...currentCart, { ...product, quantity: 1 }];
            setTotalValue(calculateTotal(updatedCart));
            return updatedCart;
        });
    };

    const removeFromCart = (productId: string) => {
        setCart((currentCart) => {
            const updatedCart = currentCart.filter((item) => item._id !== productId);
            setTotalValue(calculateTotal(updatedCart));
            return updatedCart;
        });
    };

    const increaseQuantity = (productId: string) => {
        setCart((currentCart) => {
            const updatedCart = currentCart.map((item) =>
                item._id === productId ? { ...item, quantity: item.quantity + 1 } : item,
            );
            setTotalValue(calculateTotal(updatedCart));
            return updatedCart;
        });
    };

    const decreaseQuantity = (productId: string) => {
        setCart((currentCart) => {
            const updatedCart = currentCart
                .map((item) => (item._id === productId ? { ...item, quantity: item.quantity - 1 } : item))
                .filter((item) => item.quantity > 0);
            setTotalValue(calculateTotal(updatedCart));
            return updatedCart;
        });
    };

    const placeOrder = async () => {
        const orderData: CreateOrder = {
            products: cart.map((item) => item._id),
            total: totalValue,
            date: new Date().toISOString(),
        };

        createOrder(orderData, {
            onSuccess: () => {
                setCart([]);
                setTotalValue(0);
                setIsCartOpen(false);
            },
        });
    };

    return (
        <CartContext.Provider
            value={{
                cart,
                totalValue,
                addToCart,
                removeFromCart,
                increaseQuantity,
                decreaseQuantity,
                placeOrder,
                isCartOpen,
                setIsCartOpen,
                isLoading,
				setIsLoading
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
