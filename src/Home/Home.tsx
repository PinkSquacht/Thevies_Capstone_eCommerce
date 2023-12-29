import { useContext } from "react";
import { ProductContext } from "../Product/ProductContext";
import Product from "../Product/Product";
import { Grid, Box } from '@mui/material';

const Home = () => {
  // get products from context
  const products: { id: number, category: string }[] = useContext(ProductContext);
  // getting only mens and womens clothing
  const filteredProducts = products.filter(item => {
    return item.category === "men's clothing" || item.category === "women's clothing";
  });
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={0}>
        {filteredProducts.map((product) => {
          return (
            <Grid item xs={6} key={product.id}>
              <Product product={product} />
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}

export default Home;