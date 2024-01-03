import React, { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Link } from "react-router-dom";
import StoreRoundedIcon from "@mui/icons-material/StoreRounded";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase";
import { Box, Container, Badge } from "@mui/material";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const pages = [
  { name: "Home", path: "/" },
  { name: "Account", path: "/user" },
  { name: "Signup", path: "/signup" },
];

interface IUser {
  uid: string;
  email: string;
}

function ResponsiveAppBar() {
  const [user, setUser] = useState<IUser>({ uid: "", email: "" });
  const [cartItemCount, setCartItemCount] = useState(0);

  const fetchCartItemCount = async (userId: string) => {
    const db = getFirestore();
    const cartItemsCollection = collection(db, 'users', userId, 'cartItems');
    const cartItemsSnapshot = await getDocs(cartItemsCollection);
    const itemCount = cartItemsSnapshot.docs.reduce((count, doc) => count + (doc.data().quantity || 0), 0);
    setCartItemCount(itemCount);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        if (typeof user.email === "string") {
          setUser({
            uid: user.uid,
            email: user.email,
          });

          // Fetch cart item count from Firestore
          fetchCartItemCount(user.uid);
        }
      }
    });

    // Clean up function
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const userId = user.uid;

    if (userId) {
      // Update the cart item count whenever there's a change in cart items
      fetchCartItemCount(userId);
    }
  }, [user]);

  const handleSignout = () => {
    signOut(auth)
      .then(() => {
        setUser({ uid: "", email: "" });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleRemoveItem = async (itemId: string) => {
    // Your logic to remove the item, update Firestore, etc.

    // After removing, update the cart item count
    fetchCartItemCount(user.uid);
  };

  return (
    <AppBar position="sticky" sx={{ backgroundColor: "tan", color: "black" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <StoreRoundedIcon sx={{ mr: 1 }} />
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="#app-bar-with-responsive-menu"
              sx={{
                mr: 2,
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              Muggles Magic
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          {pages.map((page) => (
            <Button
              key={page.name}
              sx={{ mr: 2, color: "black" }}
              component={Link}
              to={page.path}
            >
              {page.name}
            </Button>
          ))}

          <Box sx={{ display: "flex", alignItems: "center" }}>
            {user.email ? (
              <>
                <span>{user.email}</span>
                <Button
                  variant="outlined"
                  color="success"
                  onClick={handleSignout}
                  size="small"
                  sx={{ ml: 2, mr: 2, color: "red" }}
                >
                  SignOut
                </Button>
              </>
            ) : (
              <Button
                variant="outlined"
                color="success"
                sx={{ mr: 2, color: "light-blue" }}
                component={Link}
                to="/login"
              >
                Login
              </Button>
            )}

            <Tooltip title={`Open Cart (${cartItemCount} items)`}>
              <Link to="/cart">
                <IconButton sx={{ p: 0, color: "black" }}>
                  <Badge badgeContent={cartItemCount} color="secondary">
                    <ShoppingCartIcon />
                  </Badge>
                </IconButton>
              </Link>
            </Tooltip>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default ResponsiveAppBar;
