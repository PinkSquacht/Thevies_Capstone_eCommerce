import { useContext } from "react";
import { ProductContext } from "../contexts/ProductContext";
import Product from "../components/Product";
import { Container, Row } from 'react-bootstrap';

const Home = () => {
  // get products from context
  const products: { id: number, category: string }[] = useContext(ProductContext);
  // getting only mens and womens clothing
  const filteredProducts = products.filter(item => {
    return item.category === "men's clothing" || item.category === "women's clothing";
  });
  return (
    <Container>
      <Row>
        {filteredProducts.map((product) => {
          return (
            <Product key={product.id} product={product} />
          );
        })}
      </Row>
    </Container>
  );
}

export default Home;