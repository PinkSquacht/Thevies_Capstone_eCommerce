import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { auth } from "../firebase";
import { Card, Button, Col, Row } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';

interface CartItem {
  id: string;
  title: string;
  price: number;
  image: string;
  description: string;
  quantity: number;
}

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('User authenticated:', user.uid);
        // User is authenticated, fetch cart items
        fetchCartItems(user.uid);
      } else {
        // User is not authenticated, redirect to home page
        navigate('/');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const fetchCartItems = async (userId: string) => {
    const db = getFirestore();
    const cartItemsCollection = collection(db, 'users', userId, 'cartItems');
    const cartItemsSnapshot = await getDocs(cartItemsCollection);
    const cartItemsList: CartItem[] = cartItemsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as CartItem));
    setCartItems(cartItemsList);
  };

  const increaseQuantity = (itemId: string) => {
    setCartItems(prevCartItems => prevCartItems.map(item =>
      item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
    ));
  };

  const decreaseQuantity = (itemId: string) => {
    setCartItems(prevCartItems => {
      const updatedCart = prevCartItems.map(item =>
        item.id === itemId && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
      );
      return updatedCart.filter(item => item.quantity > 0);
    });
  };

  const removeItem = async (itemId: string) => {
    const userId = auth.currentUser?.uid;

    if (!userId) {
      console.error("User not authenticated.");
      return;
    }

    // Remove from local cart
    setCartItems(prevCartItems => prevCartItems.filter(item => item.id !== itemId));

    // Remove from Firestore collection
    const db = getFirestore();
    const cartItemRef = doc(db, 'users', userId, 'cartItems', itemId);
    console.log('itemId', itemId);
    try {
      await deleteDoc(cartItemRef);
      console.log('Item removed from Firestore');
    } catch (error) {
      console.error('Error removing item from Firestore:', error);
    }
  };

  const calculateTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleCheckout = () => {
    // Add logic for handling checkout
  };

  const handleRedirectToHome = () => {
    // Redirect to the home page
    navigate('/');
  };

  return (
    <div>
      {cartItems.length > 0 ? (
        <>
          {cartItems.map(item => (
            <Col xs={12} sm={6} md={3} lg={2} className="d-flex justify-content-center" key={item.id}>
              <Card className="h-100 my-3 text-center">
                <Row className="no-gutters">
                  <Col xs={4}>
                    <Card.Img variant="top" src={item.image} alt={item.title} style={{ height: '200px', objectFit: 'cover' }} />
                  </Col>
                  <Col xs={8}>
                    <Card.Body>
                      <Card.Title>{item.title}</Card.Title>
                      <Card.Text style={{ wordBreak: 'break-word' }}>{item.description}</Card.Text>
                      <Card.Text>
                        Price: ${item.price}
                      </Card.Text>
                      <Card.Text>
                        Quantity: {item.quantity}
                        <Button onClick={() => increaseQuantity(item.id)} variant="success" size="sm" className="mx-2">+</Button>
                        <Button onClick={() => decreaseQuantity(item.id)} variant="danger" size="sm">-</Button>
                      </Card.Text>
                      <Button onClick={() => removeItem(item.id)} variant="outline-danger" size="sm">Remove Item</Button>
                    </Card.Body>
                  </Col>
                </Row>
              </Card>
            </Col>
          ))}
          <div>
            <p>Total Price: ${calculateTotalPrice()}</p>
            <Button onClick={handleCheckout} variant="primary" size="lg">Proceed to Checkout</Button>
          </div>
        </>
      ) : (
        <div>
          <p>Cart is empty.</p>
          <Button onClick={handleRedirectToHome} variant="secondary" size="lg">Go to Home Page</Button>
        </div>
      )}
    </div>
  );
};

export default Cart;
