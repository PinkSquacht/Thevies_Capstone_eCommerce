import "./App.css";
import SignUp from "./veiws/Signup";
import Login from "./veiws/Login";
import Home from "./veiws/Home";
import UserAcct from "./veiws/UserAcct";
import Product from "./components/Product";
import { Routes, Route } from "react-router-dom";
import "@fontsource/roboto/400.css";
import { CartProvider } from "./contexts/CartContext";

function App() {
  return (
    <CartProvider>    
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Home />} />
        <Route path="/user" element={<UserAcct />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/product/:id" element={<Product product={null} />} />
      </Routes>
    </CartProvider>
  );
}

export default App;
