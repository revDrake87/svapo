import { getApiUrl } from "./apiConfig";
import { useState, useEffect, useRef } from 'react';
import './index.css';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Sun, Moon } from "lucide-react";

function CustomerView({ isDarkMode, toggleTheme, storeName, settings }) {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Advanced filters state
  const [categoryFilter, setCategoryFilter] = useState(''); // 'LIQUIDO' or 'HARDWARE'
  const [subCategoryFilter, setSubCategoryFilter] = useState('');
  const [flavorFilter, setFlavorFilter] = useState('');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    fetch(`${getApiUrl()}/products`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
      
    // Load cart from local storage if available
    const savedCart = localStorage.getItem('vapeCart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Could not parse saved cart", e);
      }
    }
  }, []);

  useEffect(() => {
    // Save cart to local storage whenever it changes
    localStorage.setItem('vapeCart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.instoreCode === product.instoreCode);
      if (existingItem) {
        return prevCart.map(item => 
          item.instoreCode === product.instoreCode ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productCode) => {
    setCart(prevCart => prevCart.filter(item => item.instoreCode !== productCode));
  };

  const updateQuantity = (productCode, newQuantity) => {
    if (newQuantity < 1) return;
    setCart(prevCart => prevCart.map(item => 
      item.instoreCode === productCode ? { ...item, quantity: newQuantity } : item
    ));
  };

  const cartTotal = cart.reduce((total, item) => total + (item.retailPrice * item.quantity), 0);

  const catalogRef = useRef(null);

  // Extract unique subCategories and flavors for the filters
  const uniqueSubCategories = [...new Set(products.filter(p => p.category === categoryFilter).map(p => p.subCategory))].filter(Boolean);
  const uniqueFlavors = [...new Set(products.filter(p => p.category === 'LIQUIDO').map(p => p.flavor))].filter(Boolean);

  const filteredProducts = products.filter(product => {
    if (product.isAvailable === false) return false;
    
    // Dropdown filters
    if (categoryFilter && product.category !== categoryFilter) return false;
    if (subCategoryFilter && product.subCategory !== subCategoryFilter) return false;
    if (flavorFilter && product.flavor !== flavorFilter) return false;

    // Search bar filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const nameMatch = product.name?.toLowerCase().includes(term);
      const flavorMatch = product.flavor?.toLowerCase().includes(term);
      const ingredientsMatch = product.ingredients?.toLowerCase().includes(term);
      if (!nameMatch && !flavorMatch && !ingredientsMatch) return false;
    }
    
    return true;
  });

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, categoryFilter, subCategoryFilter, flavorFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // GSAP Animations
  useGSAP(() => {
    if (currentProducts.length > 0) {
      gsap.fromTo(".product-card", 
        { y: 50, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out", clearProps: "all" }
      );
    }
  }, [currentProducts, currentPage]); // Re-run animation when products or page change

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0A0A0A] text-gray-900 dark:text-white font-sans transition-colors duration-300 flex flex-col">
      <header className="bg-white/80 dark:bg-[#000000]/80 backdrop-blur-md border-b border-gray-200 dark:border-white/10 p-4 sticky top-0 z-10 transition-colors duration-300">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            {settings?.logoUrl && (
              <img src={settings.logoUrl} alt="Store Logo" className="h-10 w-auto object-contain" />
            )}
            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white hidden sm:block">
              {storeName}
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-zinc-800 transition-colors">
              {isDarkMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-black" />}
            </button>
            <Link to="/admin" className="text-sm font-medium text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white transition-colors">Admin Area</Link>
            <span className="bg-gray-100 dark:bg-white/10 backdrop-blur-sm border border-gray-300 dark:border-white/20 px-4 py-1.5 rounded-full text-sm font-semibold text-gray-800 dark:text-white transition-all">
              Lista Acquisto: {cart.length}
            </span>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 flex flex-col md:flex-row gap-8 mt-6">
        {/* Catalog Section */}
        <div className="md:w-2/3" ref={catalogRef}>
          <div className="flex flex-col justify-between items-start mb-6 gap-4">
            <div className="flex w-full justify-between items-center">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Catalogo</h2>
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Cerca ingrediente o nome..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white dark:bg-[#0A0A0A] border border-gray-300 dark:border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-cyan-500 transition-colors shadow-sm"
                />
                <svg className="w-4 h-4 text-gray-400 dark:text-zinc-500 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </div>
            </div>

            {/* Advanced Filters */}
            <div className="flex flex-wrap gap-3 w-full bg-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-white/5 p-4 rounded-xl shadow-sm">
              <select 
                value={categoryFilter} 
                onChange={(e) => { setCategoryFilter(e.target.value); setSubCategoryFilter(''); setFlavorFilter(''); }}
                className="bg-gray-50 dark:bg-[#0A0A0A] border border-gray-300 dark:border-white/20 rounded-lg px-3 py-1.5 text-sm text-gray-900 dark:text-white outline-none focus:border-blue-500 dark:focus:border-cyan-500"
              >
                <option value="">Tutte le categorie</option>
                <option value="LIQUIDO">Liquidi</option>
                <option value="HARDWARE">Hardware</option>
              </select>

              {categoryFilter && (
                <select 
                  value={subCategoryFilter} 
                  onChange={(e) => setSubCategoryFilter(e.target.value)}
                  className="bg-gray-50 dark:bg-[#0A0A0A] border border-gray-300 dark:border-white/20 rounded-lg px-3 py-1.5 text-sm text-gray-900 dark:text-white outline-none focus:border-blue-500 dark:focus:border-cyan-500"
                >
                  <option value="">Tutte le Sotto-categorie</option>
                  {uniqueSubCategories.map(sub => (
                    <option key={sub} value={sub}>{sub.replace(/_/g, ' ')}</option>
                  ))}
                </select>
              )}

              {categoryFilter === 'LIQUIDO' && (
                <select 
                  value={flavorFilter} 
                  onChange={(e) => setFlavorFilter(e.target.value)}
                  className="bg-gray-50 dark:bg-[#0A0A0A] border border-gray-300 dark:border-white/20 rounded-lg px-3 py-1.5 text-sm text-gray-900 dark:text-white outline-none focus:border-blue-500 dark:focus:border-cyan-500"
                >
                  <option value="">Tutti i Gusti</option>
                  {uniqueFlavors.map(flavor => (
                    <option key={flavor} value={flavor}>{flavor}</option>
                  ))}
                </select>
              )}
            </div>
          </div>
          
          {loading && (
            <div className="flex items-center space-x-2 text-gray-400">
              <div className="w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
              <p>Caricamento prodotti...</p>
            </div>
          )}
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-200 p-4 rounded-xl mb-6 backdrop-blur-sm" role="alert">
              <p className="font-bold flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                Connessione Backend Assente
              </p>
              <p className="mt-1 text-sm text-red-200/80">({error}). Mostro dati di esempio per l'anteprima.</p>
            </div>
          )}

          {currentProducts.length > 0 && (
            <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {currentProducts.map(product => (
                <div key={product.instoreCode} className="product-card group bg-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-white/5 p-5 rounded-2xl shadow-md hover:shadow-cyan-500/20 dark:hover:shadow-cyan-500/10 transition-all duration-300 flex flex-col relative overflow-hidden">
                  <div className="absolute top-3 right-3 bg-gray-100 dark:bg-white/10 backdrop-blur-md border border-gray-200 dark:border-white/10 text-gray-800 dark:text-white text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full z-10 transition-colors">
                    {product.subCategory?.replace(/_/g, ' ')}
                  </div>
                  <Link to={`/product/${product.instoreCode}`} className="block overflow-hidden rounded-xl mb-5 mt-2">
                    <div className="h-48 bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-gray-400 dark:text-zinc-600 transition-transform duration-500 group-hover:scale-105">
                      {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.name} className="object-cover h-full w-full" />
                      ) : (
                        <svg className="w-12 h-12 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                      )}
                    </div>
                  </Link>
                  <Link to={`/product/${product.instoreCode}`} className="block">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-black dark:group-hover:text-cyan-400 transition-colors">{product.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-zinc-400 mb-4 line-clamp-2">{product.description}</p>
                  </Link>
                  
                  <div className="bg-gray-50 dark:bg-[#0A0A0A]/40 rounded-xl p-3 mb-5 flex-grow text-xs space-y-1.5 border border-gray-100 dark:border-white/5 transition-colors">
                    <div className="flex justify-between text-gray-700 dark:text-zinc-300"><span className="text-gray-500 dark:text-zinc-500 font-medium">Codice:</span> <span>{product.barcode || product.instoreCode}</span></div>
                    
                    {product.category === 'LIQUIDO' ? (
                      <>
                        {product.milliliters && <div className="flex justify-between text-gray-700 dark:text-zinc-300"><span className="text-gray-500 dark:text-zinc-500 font-medium">Quantità:</span> <span>{product.milliliters}ml</span></div>}
                        {product.flavor && <div className="flex justify-between text-gray-700 dark:text-zinc-300"><span className="text-gray-500 dark:text-zinc-500 font-medium">Gusto:</span> <span>{product.flavor}</span></div>}
                        {product.ingredients && <div className="flex justify-between text-gray-700 dark:text-zinc-300"><span className="text-gray-500 dark:text-zinc-500 font-medium">Ingredienti:</span> <span className="text-right pl-2 truncate max-w-[150px]" title={product.ingredients}>{product.ingredients}</span></div>}
                        {product.nicotineStrength && <div className="flex justify-between text-gray-700 dark:text-zinc-300"><span className="text-gray-500 dark:text-zinc-500 font-medium">Nicotina:</span> <span>{product.nicotineStrength}</span></div>}
                      </>
                    ) : (
                      <>
                        {product.color && <div className="flex justify-between text-gray-700 dark:text-zinc-300"><span className="text-gray-500 dark:text-zinc-500 font-medium">Colore:</span> <span>{product.color}</span></div>}
                        {product.batteryType && <div className="flex justify-between text-gray-700 dark:text-zinc-300"><span className="text-gray-500 dark:text-zinc-500 font-medium">Batteria:</span> <span>{product.batteryType}</span></div>}
                        {product.wattage > 0 && <div className="flex justify-between text-gray-700 dark:text-zinc-300"><span className="text-gray-500 dark:text-zinc-500 font-medium">Wattaggio Max:</span> <span>{product.wattage}W</span></div>}
                        {product.tankCapacity > 0 && <div className="flex justify-between text-gray-700 dark:text-zinc-300"><span className="text-gray-500 dark:text-zinc-500 font-medium">Capacità Tank:</span> <span>{product.tankCapacity}ml</span></div>}
                      </>
                    )}
                  </div>

                  <div className="flex justify-between items-center mt-auto pt-2 border-t border-gray-200 dark:border-white/5 transition-colors">
                    <span className="text-2xl font-black text-gray-900 dark:text-white">€{product.retailPrice?.toFixed(2)}</span>
                    <button 
                      onClick={() => addToCart(product)}
                      className="bg-[#0A0A0A] dark:bg-white hover:bg-blue-700 dark:hover:bg-cyan-400 text-white dark:text-black font-bold px-5 py-2.5 rounded-xl transition-all duration-300 active:scale-95 shadow-md dark:shadow-lg shadow-blue-500/30 dark:shadow-cyan-500/20"
                    >
                      Aggiungi
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-8">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg bg-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-white/10 text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Precedente
                </button>
                <span className="text-sm font-medium text-gray-600 dark:text-zinc-400">
                  Pagina {currentPage} di {totalPages}
                </span>
                <button 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg bg-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-white/10 text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Successiva
                </button>
              </div>
            )}
            </>
          )}
        </div>

        {/* Cart Section */}
        <div className="md:w-1/3">
          <div className="bg-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-white/5 p-6 rounded-2xl shadow-xl dark:shadow-2xl sticky top-28 transition-colors duration-300">
            <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white flex items-center gap-2">
              <svg className="w-6 h-6 text-black dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
              Lista Acquisto
            </h2>
            <p className="text-sm text-gray-500 dark:text-zinc-400 mb-6 pb-4 border-b border-gray-200 dark:border-white/10 transition-colors">
              Mostra questa schermata in negozio.
            </p>

            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 opacity-50">
                <svg className="w-16 h-16 text-gray-400 dark:text-zinc-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
                <p className="text-gray-500 dark:text-zinc-500 text-center text-sm">La lista è vuota.<br/>Aggiungi dei prodotti dal catalogo.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                {cart.map(item => (
                  <div key={item.instoreCode} className="cart-item flex justify-between items-center bg-gray-50 dark:bg-[#0A0A0A]/30 p-3 rounded-xl border border-gray-200 dark:border-white/5 group transition-all hover:bg-gray-100 dark:hover:bg-[#0A0A0A]/50">
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 dark:text-white text-sm line-clamp-1">{item.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500 dark:text-zinc-400 font-mono">€{item.retailPrice?.toFixed(2)} cad.</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 ml-4">
                      <div className="flex items-center bg-white dark:bg-zinc-800 rounded-lg p-0.5 border border-gray-200 dark:border-white/5 transition-colors">
                        <button 
                          onClick={() => updateQuantity(item.instoreCode, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center bg-transparent hover:bg-gray-100 dark:hover:bg-white/10 text-gray-600 dark:text-zinc-300 rounded-md transition-colors"
                        >
                          -
                        </button>
                        <span className="w-6 text-center text-sm font-bold text-gray-900 dark:text-white">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.instoreCode, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center bg-transparent hover:bg-gray-100 dark:hover:bg-white/10 text-gray-600 dark:text-zinc-300 rounded-md transition-colors"
                        >
                          +
                        </button>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.instoreCode)}
                        className="text-[10px] uppercase font-bold text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        Rimuovi
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {cart.length > 0 && (
              <div className="mt-6 pt-5 border-t border-gray-200 dark:border-white/10 transition-colors">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-gray-500 dark:text-zinc-400 font-medium uppercase text-sm tracking-wider">Totale stimato</span>
                  <span className="text-3xl font-black text-black dark:text-cyan-400">€{cartTotal.toFixed(2)}</span>
                </div>
                <button className="w-full vercel-button-primary py-4 px-6 rounded-xl text-lg flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                  Mostra in Negozio
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="mt-auto border-t border-gray-200 dark:border-white/10 bg-white dark:bg-[#0A0A0A] py-8 transition-colors">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500 dark:text-zinc-400">
          <div className="flex items-center gap-3">
            {settings?.logoUrl && <img src={settings.logoUrl} alt="Logo Footer" className="h-6 grayscale opacity-50" />}
            <p>&copy; {new Date().getFullYear()} {storeName}. Tutti i diritti riservati.</p>
          </div>
          
          {settings?.address && (
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              {settings.address}
            </div>
          )}

          <div className="flex items-center gap-4">
            {settings?.instagram && (
              <a href={settings.instagram} target="_blank" rel="noreferrer" className="hover:text-black dark:hover:text-white transition-colors">
                Instagram
              </a>
            )}
            {settings?.facebook && (
              <a href={settings.facebook} target="_blank" rel="noreferrer" className="hover:text-black dark:hover:text-white transition-colors">
                Facebook
              </a>
            )}
            {settings?.tiktok && (
              <a href={settings.tiktok} target="_blank" rel="noreferrer" className="hover:text-black dark:hover:text-white transition-colors">
                TikTok
              </a>
            )}
            {settings?.whatsapp && (
              <a href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="hover:text-green-500 transition-colors">
                WhatsApp
              </a>
            )}
          </div>
        </div>
      </footer>

      <style jsx="true">{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
}

export default CustomerView;
