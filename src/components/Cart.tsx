import React, { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { auth } from "../firebase";
import { Card, Button, Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { increment, updateDoc } from "firebase/firestore";

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
        console.log("User authenticated:", user.uid);
        // User is authenticated, fetch cart items
        fetchCartItems(user.uid);
      } else {
        // User is not authenticated, redirect to home page
        navigate("/");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const fetchCartItems = async (userId: string) => {
    const db = getFirestore();
    const cartItemsCollection = collection(db, "users", userId, "cartItems");
    const cartItemsSnapshot = await getDocs(cartItemsCollection);
    const cartItemsList: CartItem[] = cartItemsSnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as CartItem)
    );
    setCartItems(cartItemsList);
  };

  const increaseQuantity = async (itemId: string) => {
    setCartItems((prevCartItems) =>
      prevCartItems.map((item) =>
        item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );

    await updateFirestoreQuantity(itemId, 1);
  };

  const decreaseQuantity = async (itemId: string) => {
    setCartItems((prevCartItems) => {
      const updatedCart = prevCartItems.map((item) =>
        item.id === itemId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
      return updatedCart.filter((item) => item.quantity > 0);
    });

    await updateFirestoreQuantity(itemId, -1);
  };

  const updateFirestoreQuantity = async (itemId: string, change: number) => {
    const userId = auth.currentUser?.uid;

    if (!userId) {
      console.error("User not authenticated.");
      return;
    }

    const db = getFirestore();
    const cartItemRef = doc(db, "users", userId, "cartItems", String(itemId));

    try {
      await updateDoc(cartItemRef, {
        quantity: increment(change),
      });
      console.log("Item quantity updated in Firestore!");
    } catch (error) {
      console.error("Error updating item quantity in Firestore:", error);
    }
  };

  const removeItem = async (itemId: string) => {
    const userId = auth.currentUser?.uid;

    if (!userId) {
      console.error("User not authenticated.");
      return;
    }

    // Remove from local cart
    setCartItems((prevCartItems) =>
      prevCartItems.filter((item) => item.id !== itemId)
    );

    // Remove from Firestore collection
    const db = getFirestore();
    const cartItemRef = doc(db, "users", userId, "cartItems", String(itemId)); // Convert itemId to string

    console.log("Removing item from Firestore. Path:", cartItemRef.path);

    try {
      await deleteDoc(cartItemRef);
      console.log("Item removed from Firestore");
    } catch (error) {
      console.error("Error removing item from Firestore:", error);
    }
  };

  const calculateTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const handleCheckout = () => {
    // Add logic for handling checkout
  };

  const handleRedirectToHome = () => {
    // Redirect to the home page
    navigate("/");
  };

  return (
    <div className="container mt-5">
      {cartItems.length > 0 ? (
        <>
          <Row xs={1} md={2} lg={3} className="g-4">
            {cartItems.map((item) => (
              <Col key={item.id} className="d-flex justify-content-center">
                <Card
                  className="h-100 my-3 text-center"
                  style={{ paddingTop: "20px" }}
                >
                  <Row className="no-gutters">
                    <Col xs={4}>
                      <Card.Img
                        variant="top"
                        src={item.image}
                        alt={item.title}
                        className="img-fluid"
                        style={{ maxHeight: "100px", objectFit: "cover" }}
                      />
                    </Col>
                    <Col xs={8}>
                      <Card.Body>
                        <Card.Title>{item.title}</Card.Title>
                        <Card.Text className="text-muted">
                          {item.description}
                        </Card.Text>
                        <Card.Text className="fw-bold">
                          Price: ${item.price.toFixed(2)}
                        </Card.Text>
                        <Card.Text className="mb-3 d-flex align-items-center">
                          Quantity: {item.quantity}
                          <Button
                            onClick={() => decreaseQuantity(item.id)}
                            variant="outline-secondary"
                            size="sm"
                            className="ms-2"
                            style={{
                              marginRight: "5px",
                              backgroundColor: "#28a745",
                              borderColor: "#28a745",
                            }}
                          >
                            -
                          </Button>
                          <Button
                            onClick={() => increaseQuantity(item.id)}
                            variant="outline-secondary"
                            size="sm"
                            className="ms-2"
                            style={{
                              marginRight: "5px",
                              backgroundColor: "#28a745",
                              borderColor: "#28a745",
                            }}
                          >
                            +
                          </Button>
                        </Card.Text>
                        <Button
                          onClick={() => removeItem(item.id)}
                          variant="danger"
                          size="sm"
                          style={{
                            marginRight: "5px",
                            backgroundColor: "#28a745",
                            borderColor: "#28a745",
                          }}
                        >
                          Remove Item
                        </Button>
                      </Card.Body>
                    </Col>
                  </Row>
                </Card>
              </Col>
            ))}
          </Row>
          <div className="mt-3">
            <p className="fw-bold">
              Total Price: ${calculateTotalPrice().toFixed(2)}
            </p>
            <Button
              onClick={handleCheckout}
              variant="success"
              size="lg"
              style={{
                marginRight: "5px",
                backgroundColor: "#28a745",
                borderColor: "#28a745",
              }}
            >
              Proceed to Checkout
            </Button>
          </div>
        </>
      ) : (
        <div className="text-center">
          <p>Your cart is empty.</p>
          <Button
            onClick={handleRedirectToHome}
            variant="success"
            size="lg"
            style={{
              marginRight: "5px",
              backgroundColor: "#28a745",
              borderColor: "#28a745",
            }}
          >
            Go to Home Page
          </Button>
        </div>
      )}
    </div>
  );
};

export default Cart;
