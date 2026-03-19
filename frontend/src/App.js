import { useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Services from "./pages/Services";
import Products from "./pages/Products";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ZohoCallback from './pages/ZohoCallback';
import FloatingActions from "./components/FloatingActions";
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/zoho-callback" element={<ZohoCallback />} />
          
          {/* Public Routes */}
          <Route path="/*" element={
            <>
              <Header />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/servicios" element={<Services />} />
                <Route path="/productos" element={<Products />} />
                <Route path="/nosotros" element={<About />} />
                <Route path="/contacto" element={<Contact />} />
                <Route path="/blog" element={<Blog />} />
              </Routes>
              <FloatingActions />
              <Footer />
            </>
          } />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </div>
  );
}

export default App;