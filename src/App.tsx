import { BrowserRouter, Routes, Route } from "react-router-dom"
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ComingSoon from "./pages/ComingSoon";
import About from "./pages/About";
import ScrollToTop from "./components/utilis/ScrollToTop";
import Help from "./pages/Help";
import Register from "./pages/Register";
import SignIn from "./pages/SignIn";
import Sell from "./pages/Sell";
import Suppliers from "./pages/Suppliers";
import Products from "./pages/Products";


const App = () => (
  <BrowserRouter>
    <ScrollToTop />
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/help" element={<Help />} />
      <Route path="/register" element={<Register />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/sell" element={<Sell />} />
      <Route path="/suppliers/:id" element={<Suppliers />} />
      <Route path="/suppliers" element={<Suppliers />} />
      <Route path="/products" element={<Products />} />
      <Route path="/products/:id" element={<Products />} />
      <Route path="/about" element={<About />} />
      <Route path="/coming-soon" element={<ComingSoon />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

export default App;