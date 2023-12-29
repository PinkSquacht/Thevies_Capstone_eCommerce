import "./App.css";
import SignUp from "./Signup/Signup";
import Login from "./Login/Login";
import Home from "./Home/Home";
import Cart from "./Cart/Cart";
import UserAcct from "./UserAcct/UserAcct";
import Product from "./Product/Product";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "@fontsource/roboto/400.css";

function App() {
  return (      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/user" element={<UserAcct />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/product/:id" element={<Product />} />
      </Routes>
  );
}

export default App;
