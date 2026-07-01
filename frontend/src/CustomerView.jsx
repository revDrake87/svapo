import { getApiUrl } from "./apiConfig";
import { useState, useEffect, useRef } from 'react';
import './index.css';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Header from './Header';

function CustomerView({ storeCode, isThemeFixed, isDarkMode, toggleTheme, storeName, settings, cart, setCart }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Advanced filters state
  const [categoryFilter, setCategoryFilter] = useState(''); // 'LIQUIDO' or 'HARDWARE'
  const [subCategoryFilter, setSubCategoryFilter] = useState('');
  const [flavorFilter, setFlavorFilter] = useState('');
  
  // Infinite scroll state
  const [visibleCount, setVisibleCount] = useState(6);
  const observerTarget = useRef(null);

  useEffect(() => {
    fetch(`${getApiUrl()}/api/products?storeId=${storeCode}`)
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
  }, []);

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

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(6);
  }, [searchTerm, categoryFilter, subCategoryFilter, flavorFilter]);

  const currentProducts = filteredProducts.slice(0, visibleCount);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleCount < filteredProducts.length) {
          setVisibleCount((prevCount) => prevCount + 6);
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [observerTarget, visibleCount, filteredProducts.length]);

  // GSAP Animations
  useGSAP(() => {
    if (currentProducts.length > 0) {
      gsap.fromTo(".product-card:not(.gsap-animated)", 
        { y: 50, opacity: 0 }, 
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.5, 
          stagger: 0.1, 
          ease: "power2.out", 
          clearProps: "all",
          onComplete: function() {
            this.targets().forEach(el => el.classList.add('gsap-animated'));
          }
        }
      );
    }
  }, [currentProducts.length]); // Re-run animation when visible count changes

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0A0A0A] text-gray-900 dark:text-white font-sans transition-colors duration-300 flex flex-col">
      <Header 
        isThemeFixed={isThemeFixed}
        isDarkMode={isDarkMode} 
        toggleTheme={toggleTheme} 
        storeName={storeName} 
        settings={settings} 
        cartItemCount={cart.length} 
      />

      <main className="container mx-auto p-4 flex flex-col gap-8 mt-6 flex-grow">
        {/* Catalog Section */}
        <div className="w-full" ref={catalogRef}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div className="flex w-full justify-between items-center">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Catalogo</h2>
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Cerca ingrediente o nome..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white dark:bg-[#0A0A0A] border border-gray-300 dark:border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-brand transition-colors shadow-sm"
                />
                <svg className="w-4 h-4 text-gray-400 dark:text-zinc-500 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </div>
            </div>

            {/* Advanced Filters */}
            <div className="flex flex-wrap gap-3 w-full bg-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-white/5 p-4 rounded-xl shadow-sm">
              <select 
                value={categoryFilter} 
                onChange={(e) => { setCategoryFilter(e.target.value); setSubCategoryFilter(''); setFlavorFilter(''); }}
                className="bg-gray-50 dark:bg-[#0A0A0A] border border-gray-300 dark:border-white/20 rounded-lg px-3 py-1.5 text-sm text-gray-900 dark:text-white outline-none focus:border-brand dark:focus:border-brand"
              >
                <option value="">Tutte le categorie</option>
                <option value="LIQUIDO">Liquidi</option>
                <option value="HARDWARE">Hardware</option>
              </select>

              {categoryFilter && (
                <select 
                  value={subCategoryFilter} 
                  onChange={(e) => setSubCategoryFilter(e.target.value)}
                  className="bg-gray-50 dark:bg-[#0A0A0A] border border-gray-300 dark:border-white/20 rounded-lg px-3 py-1.5 text-sm text-gray-900 dark:text-white outline-none focus:border-brand dark:focus:border-brand"
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
                  className="bg-gray-50 dark:bg-[#0A0A0A] border border-gray-300 dark:border-white/20 rounded-lg px-3 py-1.5 text-sm text-gray-900 dark:text-white outline-none focus:border-brand dark:focus:border-brand"
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
              <div className="w-5 h-5 border-2 border-brand border-t-transparent rounded-full animate-spin"></div>
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
                  <Link to={`/${storeCode}/product/${product.instoreCode}`} className="block overflow-hidden rounded-xl mb-5 mt-2">
                    <div className="h-48 bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-gray-400 dark:text-zinc-600 transition-transform duration-500 group-hover:scale-105">
                      {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.name} className="object-cover h-full w-full" />
                      ) : (
                        <svg className="w-12 h-12 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                      )}
                    </div>
                  </Link>
                  <Link to={`/${storeCode}/product/${product.instoreCode}`} className="block">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-black dark:group-hover:text-brand transition-colors">{product.name}</h3>
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
                      className="bg-[#0A0A0A] dark:bg-white hover:bg-brand dark:hover:bg-brand text-white dark:text-black font-bold px-5 py-2.5 rounded-xl transition-all duration-300 active:scale-95 shadow-md dark:shadow-lg shadow-blue-500/30 dark:shadow-cyan-500/20"
                    >
                      Aggiungi
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Infinite Scroll Observer Target */}
            {visibleCount < filteredProducts.length && (
              <div ref={observerTarget} className="h-10 w-full mt-4 flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-brand border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default CustomerView;
