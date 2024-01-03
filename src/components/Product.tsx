import React from "react";
import { BsPlus } from "react-icons/bs";
import { Card, Button, Col, Row } from "react-bootstrap";
import { db } from "../firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { auth } from "../firebase";

const Product = ({ product }: { product: any }) => {
  const { id, title, price, image, description } = product;
  const userId = auth.currentUser?.uid;

  const handleAddToCart = async () => {
    if (!userId) {
      console.error("User not authenticated.");
      return;
    }

    const cartItemRef = doc(db, "users", userId, "cartItems", id.toString());

    const cartItemDoc = await getDoc(cartItemRef);

    if (cartItemDoc.exists()) {
      const currentQuantity = cartItemDoc.data().quantity || 0;
      const newQuantity = currentQuantity + 1;

      await updateDoc(cartItemRef, {
        quantity: newQuantity,
      });

      console.log("Item quantity updated in Firestore!");
    } else {
      await setDoc(cartItemRef, {
        id,
        title,
        price,
        image,
        description,
        quantity: 1,
      });

      console.log("Item added to Firestore!");
    }
  };

  return (
    <Col xs={12} sm={6} md={3} lg={2} className="d-flex justify-content-center">
      <Card className="h-100 my-3 text-center" style={{ paddingTop: '20px' }}>
        <Row className="no-gutters">
          <Col xs={4}>
            <Card.Img
              variant="top"
              src={image}
              alt={title}
              className="img-fluid"
              style={{ height: '150px', objectFit: 'cover' }}
            />
          </Col>
          <Col xs={8}>
            <Card.Body>
              <Card.Title>{title}</Card.Title>
              <Card.Text style={{ wordBreak: 'break-word' }}>{description}</Card.Text>
              <Card.Text>
                Price: ${price}
              </Card.Text>
            </Card.Body>
            <Card.Footer className="d-flex justify-content-center">
              <Button
                onClick={handleAddToCart}
                variant="success"
                style={{ marginRight: '5px', backgroundColor: '#28a745', borderColor: '#28a745' }}
              >
                <BsPlus /> Add to Cart
              </Button>
            </Card.Footer>
          </Col>
        </Row>
      </Card>
    </Col>
  );
};

export default Product;
