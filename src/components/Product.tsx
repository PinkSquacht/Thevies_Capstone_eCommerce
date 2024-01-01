import React, { useContext } from "react";
import { BsPlus } from "react-icons/bs";
import { Card, Button, Col, Row } from "react-bootstrap";
import { CartContext } from "../contexts/CartContext";

const Product = ({ product }: { product: any }) => {
  const { addToCart } = useContext(CartContext);
  const { id, title, price, image, description } = product;

  return (
    <Col xs={12} sm={6} md={3} lg={2} className="d-flex justify-content-center">
      <Card className="h-100 my-3 text-center">
        <Row className="no-gutters">
          <Col xs={4}>
            <Card.Img variant="top" src={image} alt={title} style={{ height: '200px', objectFit: 'cover' }} />
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
                onClick={() => addToCart ? addToCart(product, id) : null}
                variant="success"
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