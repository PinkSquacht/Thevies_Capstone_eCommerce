import { createContext, useContext, useState, useMemo, useCallback } from "react";

type CartContext = {
    cartCount: number;
    cartItems: CartItem[];
    addToCart: (product: any, id: any) => void;
    openCart: () => void;
    closeCart: () => void;
    getItemCount: (id: number) => number;
    increaseCount: (id: number) => void;
    decreaseCount: (id: number) => void;
    removeFromCart: (id: number) => void;
};

type CartItem = {
    id: number;
    count: number;
    price: number;
    title: string;
};

type CartProviderProps = {
    children: React.ReactNode;
};

export const CartContext = createContext<Partial<CartContext>>({});

export function useCart() {
    return useContext(CartContext);
}

export function CartProvider({ children }: CartProviderProps) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [cartOpen, setCartOpen] = useState(false);

    const addToCart = useCallback((product: any, id: any) => {
        setCart((cart) => {
            const cartItem = cart.find((item) => item.id === id);
            if (cartItem) {
                return cart.map((item) => item.id === id ? { ...item, count: item.count + 1 } : item);
            } else {
                return [...cart, { ...product, count: 1, price: product.price, title: product.title, id: id }];
            }
        });
    }, []);

    const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.count, 0), [cart]);
    const cartItems = useMemo(() => cart, [cart]);

    const openCart = useCallback(() => setCartOpen(true), []);
    const closeCart = useCallback(() => setCartOpen(false), []);

    const getItemCount = useCallback((id: number) => cart.find((item) => item.id === id)?.count || 0, [cart]);

    const increaseCount = useCallback((id: number) => {
        setCart((cart) => cart.map((item) => item.id === id ? { ...item, count: item.count + 1 } : item));
    }, []);

    const decreaseCount = useCallback((id: number) => {
        setCart((cart) => cart.map((item) => item.id === id && item.count > 1 ? { ...item, count: item.count - 1 } : item).filter(item => item.count > 0));
    }, []);

    const removeFromCart = useCallback((id: number) => {
        setCart((cart) => cart.filter((item) => item.id !== id));
    }, []);

    return (
        <CartContext.Provider
            value={{
                cartCount,
                cartItems,
                addToCart,
                openCart,
                closeCart,
                getItemCount,
                increaseCount,
                decreaseCount,
                removeFromCart
            }}
        >
            {children}
        </CartContext.Provider>
    );
}