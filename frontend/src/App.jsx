import { getApiUrl } from "./apiConfig";
import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import CustomerView from './CustomerView';
import AdminDashboard from './AdminDashboard';
import ProductDetail from './ProductDetail';
import CartView from './CartView';
import './index.css';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [storeName, setStoreName] = useState('VapeStore');
  const [settings, setSettings] = useState({
    storeName: 'VapeStore',
    logoUrl: '',
    address: '',
    instagram: '',
    facebook: '',
    tiktok: '',
    whatsapp: ''
  });

  const [cart, setCart] = useState([]);

  useEffect(() => {
    // Load cart from local storage if available
    const savedCart = localStorage.getItem('vapeCart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Could not parse saved cart", e);
      }
    }

    // Check local storage for theme preference
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'light') {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    } else {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode ? 'dark' : 'light';
    setIsDarkMode(!isDarkMode);
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    localStorage.setItem('theme', newTheme);
  };

  useEffect(() => {
    // Save cart to local storage whenever it changes
    localStorage.setItem('vapeCart', JSON.stringify(cart));
  }, [cart]);

  return (
    <Routes>
      <Route path="/" element={
        <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold mb-4">Svapo Store Digital Catalog</h1>
            <p className="text-gray-500 mb-8">Benvenuto. Per favore, naviga verso l'URL specifico del tuo negozio.</p>
            <a href="/admin" className="text-blue-500 hover:underline">Accedi all'Area Admin</a>
        </div>
      } />
      <Route path="/:storeSlug" element={<CustomerView isDarkMode={isDarkMode} toggleTheme={toggleTheme} cart={cart} setCart={setCart} />} />
      <Route path="/:storeSlug/cart" element={<CartView isDarkMode={isDarkMode} toggleTheme={toggleTheme} cart={cart} setCart={setCart} />} />
      <Route path="/:storeSlug/product/:id" element={<ProductDetail isDarkMode={isDarkMode} toggleTheme={toggleTheme} cart={cart} setCart={setCart} />} />
      <Route path="/admin" element={<AdminDashboard isDarkMode={isDarkMode} toggleTheme={toggleTheme} />} />
    </Routes>
  );
}

export default App;
