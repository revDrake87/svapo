import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import CustomerView from './CustomerView';
import AdminDashboard from './AdminDashboard';
import ProductDetail from './ProductDetail';
import './index.css';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [storeName, setStoreName] = useState('VapeStore');

  useEffect(() => {
    // Fetch store name
    fetch('http://localhost:8080/api/settings')
      .then(res => res.json())
      .then(data => setStoreName(data.storeName))
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

  return (
    <Routes>
      <Route path="/" element={<CustomerView isDarkMode={isDarkMode} toggleTheme={toggleTheme} storeName={storeName} />} />
      <Route path="/product/:id" element={<ProductDetail isDarkMode={isDarkMode} toggleTheme={toggleTheme} storeName={storeName} />} />
      <Route path="/admin" element={<AdminDashboard isDarkMode={isDarkMode} toggleTheme={toggleTheme} storeName={storeName} setStoreName={setStoreName} />} />
    </Routes>
  );
}

export default App;
