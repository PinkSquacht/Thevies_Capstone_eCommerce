import * as React from "react";
import { useEffect, useState } from "react"; // Import the missing useEffect and useState
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"; // Import the missing ShoppingCartIcon
import { Link } from "react-router-dom";
import StoreRoundedIcon from "@mui/icons-material/StoreRounded";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase";
import { Box, Container } from "@mui/material";
import { CartContext } from "../contexts/CartContext";

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
  console.log(React.useContext(CartContext));
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );

  
  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const [user, setUser] = useState<IUser>({ uid: "", email: "" });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        if (typeof user.email === "string") {
          setUser({
            uid: user.uid,
            email: user.email,
          });
        }
      }
    });

    // Clean up function
    return () => unsubscribe();
  }, []);

  const handleSignout = () => {
    signOut(auth)
      .then(() => {
        setUser({ uid: "", email: "" });
      })
      .catch((error) => {
        console.log(error);
      });
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
              onClick={handleCloseNavMenu}
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
                onClick={handleCloseNavMenu}
                sx={{ mr: 2, color: "light-blue" }}
                component={Link}
                to="/login"
              >
                Login
              </Button>
            )}

            <Tooltip title="Open Cart">
              <Link to="/cart">
                <IconButton sx={{ p: 0, color: "black" }}>
                  <ShoppingCartIcon />
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
