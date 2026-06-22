import { getApiUrl } from "./apiConfig";
import { useState, useEffect } from 'react';
import { Routes, Route, useParams, Navigate } from 'react-router-dom';
import CustomerView from './CustomerView';
import AdminDashboard from './AdminDashboard';
import ProductDetail from './ProductDetail';
import CartView from './CartView';
import './index.css';

function StoreWrapper() {
  const { storeCode } = useParams();
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
    const savedCart = localStorage.getItem(`vapeCart_${storeCode}`);
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Could not parse saved cart", e);
      }
    } else {
        setCart([]);
    }

    // Fetch store settings using url param
    fetch(`${getApiUrl()}/settings/${storeCode}`)
      .then(res => res.json())
      .then(data => {
        setStoreName(data.storeName);
        setSettings({
          storeName: data.storeName || 'VapeStore',
          logoUrl: data.logoUrl || '',
          address: data.address || '',
          instagram: data.instagram || '',
          facebook: data.facebook || '',
          tiktok: data.tiktok || '',
          whatsapp: data.whatsapp || ''
        });
      })
      .catch(err => console.error("Failed to load store settings", err));

    // Check local storage for theme preference
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'light') {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    } else {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, [storeCode]);

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
    // Save cart to local storage whenever it changes, keeping it store specific
    if (storeCode) {
      localStorage.setItem(`vapeCart_${storeCode}`, JSON.stringify(cart));
    }
  }, [cart, storeCode]);

  return (
    <Routes>
      <Route path="/" element={<CustomerView storeCode={storeCode} isDarkMode={isDarkMode} toggleTheme={toggleTheme} storeName={storeName} settings={settings} cart={cart} setCart={setCart} />} />
      <Route path="cart" element={<CartView storeCode={storeCode} isDarkMode={isDarkMode} toggleTheme={toggleTheme} storeName={storeName} settings={settings} cart={cart} setCart={setCart} />} />
      <Route path="product/:id" element={<ProductDetail storeCode={storeCode} isDarkMode={isDarkMode} toggleTheme={toggleTheme} storeName={storeName} settings={settings} cart={cart} setCart={setCart} />} />
      <Route path="admin" element={<AdminDashboard storeCode={storeCode} isDarkMode={isDarkMode} toggleTheme={toggleTheme} storeName={storeName} setStoreName={setStoreName} settings={settings} setSettings={setSettings} />} />
    </Routes>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/:storeCode/*" element={<StoreWrapper />} />
      <Route path="/" element={<Navigate to="/PROFESSIONAL_VAPE" />} />
    </Routes>
  );
}

export default App;
