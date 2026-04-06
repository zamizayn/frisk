import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1, variant = null) => {
    setCartItems(prev => {
      const existing = prev.find(item => 
        item.id === product.id && 
        (variant ? item.variant?.id === variant.id : !item.variant)
      );

      if (existing) {
        return prev.map(item => 
          item.id === product.id && 
          (variant ? item.variant?.id === variant.id : !item.variant)
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity, variant }];
    });
  };

  const removeFromCart = (id, variantId = null) => {
    setCartItems(prev => prev.filter(item => 
      !(item.id === id && (variantId ? item.variant?.id === variantId : true))
    ));
  };

  const updateQuantity = (id, quantity, variantId = null) => {
    if (quantity < 1) return removeFromCart(id, variantId);
    setCartItems(prev => prev.map(item => 
      (item.id === id && (variantId ? item.variant?.id === variantId : true))
        ? { ...item, quantity }
        : item
    ));
  };

  const clearCart = () => setCartItems([]);

  const cartTotal = cartItems.reduce((acc, item) => {
    const price = item.variant?.priceOverride || item.price;
    return acc + price * item.quantity;
  }, 0);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
      cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
