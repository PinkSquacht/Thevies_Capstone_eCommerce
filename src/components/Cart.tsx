import React from 'react';
import { useCart } from '../contexts/CartContext';
import { Link } from 'react-router-dom';


function Cart() {
  const { cartItems, removeFromCart } = useCart();

  return (
    <div>
      <h1>Your Cart</h1>
      {cartItems.length > 0 ? cartItems.map((item) => (
        <div key={item.id}>
          <h2>{item.title}</h2>
          <p>Price: {item.price}</p>
          <p>Count: {item.count}</p>
          <p>Total: {item.price * item.count}</p>
          <button onClick={() => removeFromCart(item.id)}>Remove from cart</button>
        </div>
      )) : <p>Your cart is empty.</p>}
    </div>
  );
}

export default Cart;
// 