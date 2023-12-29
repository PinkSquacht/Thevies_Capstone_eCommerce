import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import SignUp from "./Signup/Signup.tsx";
import { BrowserRouter } from "react-router-dom";
import Navbar from "./Navbar/Navbar.tsx";
import ProductProvider from "./Product/ProductContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ProductProvider>
    <React.StrictMode>
      <BrowserRouter>
        <Navbar />
        <App />
      </BrowserRouter>
    </React.StrictMode>
  </ProductProvider>
);