import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import CustomerView from './CustomerView';
import AdminDashboard from './AdminDashboard';
import './index.css';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
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
      <Route path="/" element={<CustomerView isDarkMode={isDarkMode} toggleTheme={toggleTheme} />} />
      <Route path="/admin" element={<AdminDashboard isDarkMode={isDarkMode} toggleTheme={toggleTheme} />} />
    </Routes>
  );
}

export default App;
