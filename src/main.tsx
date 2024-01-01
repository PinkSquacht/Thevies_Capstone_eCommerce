import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import SignUp from "./veiws/Signup.tsx";
import { BrowserRouter } from "react-router-dom";
import Navbar from "./components/Navbar.tsx";
import ProductProvider from "./contexts/ProductContext.tsx";
import { CartProvider } from "./contexts/CartContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <CartProvider>
    <ProductProvider>
      <React.StrictMode>
        <BrowserRouter>
          <Navbar />
          <App />
        </BrowserRouter>
      </React.StrictMode>
    </ProductProvider>
  </CartProvider>
);
