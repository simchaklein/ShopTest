export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  emoji: string;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

export function getCartFromLocalStorage(): Cart {
  if (typeof window === 'undefined') {
    return { items: [], total: 0 };
  }
  
  try {
    const cart = localStorage.getItem('shoptest_cart');
    return cart ? JSON.parse(cart) : { items: [], total: 0 };
  } catch {
    return { items: [], total: 0 };
  }
}

export function saveCartToLocalStorage(cart: Cart) {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('shoptest_cart', JSON.stringify(cart));
  } catch (error) {
    console.error('Error saving cart:', error);
  }
}

export function addToCart(cart: Cart, item: CartItem): Cart {
  const existingItem = cart.items.find(i => i.id === item.id);
  
  if (existingItem) {
    existingItem.quantity += item.quantity;
  } else {
    cart.items.push(item);
  }
  
  updateCartTotal(cart);
  return cart;
}

export function removeFromCart(cart: Cart, itemId: string): Cart {
  cart.items = cart.items.filter(i => i.id !== itemId);
  updateCartTotal(cart);
  return cart;
}

export function updateQuantity(cart: Cart, itemId: string, quantity: number): Cart {
  const item = cart.items.find(i => i.id === itemId);
  if (item) {
    item.quantity = Math.max(1, quantity);
  }
  updateCartTotal(cart);
  return cart;
}

export function clearCart(cart: Cart): Cart {
  cart.items = [];
  cart.total = 0;
  return cart;
}

function updateCartTotal(cart: Cart) {
  cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}
