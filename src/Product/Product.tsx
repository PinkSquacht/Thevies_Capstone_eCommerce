import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { BsPlus, BsEyeFill } from "react-icons/bs";
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
} from "@mui/material";

const Product = ({ product }: { product: any }) => {
  const { id, title, price, description, category, image } = product;

  // Limit the length of the description
  const shortDescription =
    description.length > 60
      ? description.substring(0, 57) + "..."
      : description;

  return (
    <Grid item xs={12} sm={6} md={4} lg={3}>
      <Card sx={{ maxWidth: 345, padding: 2, margin: 2 }}>
        <CardMedia component="img" height="140" image={image} alt={title} />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {shortDescription}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Price: ${price}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Category: {category}
          </Typography>
        </CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", p: 1 }}>
          <Button
            component={RouterLink}
            to={`/product/${id}`}
            variant="contained"
            color="primary"
            startIcon={<BsEyeFill />}
          >
            View
          </Button>
          <Button
            component={RouterLink}
            to={`/product/${id}`}
            variant="contained"
            color="secondary"
            startIcon={<BsPlus />}
          >
            Add to Cart
          </Button>
        </Box>
      </Card>
    </Grid>
  );
};

export default Product;
