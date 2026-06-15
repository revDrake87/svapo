import { useState, useEffect, useRef } from 'react';
import './index.css';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Sun, Moon } from 'lucide-react';

function CustomerView({ isDarkMode, toggleTheme }) {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('http://localhost:8080/api/products')
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

  const filteredProducts = products.filter(product => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    const nameMatch = product.name?.toLowerCase().includes(term);
    const flavorMatch = product.flavor?.toLowerCase().includes(term);
    const ingredientsMatch = product.ingredients?.toLowerCase().includes(term);
    return nameMatch || flavorMatch || ingredientsMatch;
  });

  // GSAP Animations
  useGSAP(() => {
    if (products.length > 0) {
      gsap.fromTo(".product-card", 
        { y: 50, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out", clearProps: "all" }
      );
    }
  }, [products]); // Re-run animation when products load

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white font-sans transition-colors duration-300">
      <header className="bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-gray-200 dark:border-white/10 p-4 sticky top-0 z-10 transition-colors duration-300">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            VapeStore
          </h1>
          <div className="flex items-center space-x-4">
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-zinc-800 transition-colors">
              {isDarkMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-blue-600" />}
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
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Catalogo</h2>
            
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Cerca ingrediente, gusto o nome..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white dark:bg-zinc-900 border border-gray-300 dark:border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-cyan-500 transition-colors shadow-sm"
              />
              <svg className="w-4 h-4 text-gray-400 dark:text-zinc-500 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
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

          {filteredProducts.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <div key={product.instoreCode} className="product-card group bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/5 p-5 rounded-2xl shadow-md hover:shadow-cyan-500/20 dark:hover:shadow-cyan-500/10 transition-all duration-300 flex flex-col relative overflow-hidden">
                  <div className="absolute top-3 right-3 bg-gray-100 dark:bg-white/10 backdrop-blur-md border border-gray-200 dark:border-white/10 text-gray-800 dark:text-white text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full z-10 transition-colors">
                    {product.subCategory?.replace(/_/g, ' ')}
                  </div>
                  <div className="h-48 bg-gray-100 dark:bg-zinc-800 rounded-xl mb-5 flex items-center justify-center text-gray-400 dark:text-zinc-600 overflow-hidden mt-2 transition-transform duration-500 group-hover:scale-105">
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.name} className="object-cover h-full w-full" />
                    ) : (
                      <svg className="w-12 h-12 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors">{product.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-zinc-400 mb-4 line-clamp-2">{product.description}</p>
                  
                  <div className="bg-gray-50 dark:bg-black/40 rounded-xl p-3 mb-5 flex-grow text-xs space-y-1.5 border border-gray-100 dark:border-white/5 transition-colors">
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
                      className="bg-blue-600 dark:bg-cyan-500 hover:bg-blue-700 dark:hover:bg-cyan-400 text-white dark:text-black font-bold px-5 py-2.5 rounded-xl transition-all duration-300 active:scale-95 shadow-md dark:shadow-lg shadow-blue-500/30 dark:shadow-cyan-500/20"
                    >
                      Aggiungi
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cart Section */}
        <div className="md:w-1/3">
          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/5 p-6 rounded-2xl shadow-xl dark:shadow-2xl sticky top-28 transition-colors duration-300">
            <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white flex items-center gap-2">
              <svg className="w-6 h-6 text-blue-600 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
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
                  <div key={item.instoreCode} className="cart-item flex justify-between items-center bg-gray-50 dark:bg-black/30 p-3 rounded-xl border border-gray-200 dark:border-white/5 group transition-all hover:bg-gray-100 dark:hover:bg-black/50">
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
                  <span className="text-3xl font-black text-blue-600 dark:text-cyan-400">€{cartTotal.toFixed(2)}</span>
                </div>
                <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-cyan-500 dark:to-blue-600 hover:from-blue-500 hover:to-indigo-500 dark:hover:from-cyan-400 dark:hover:to-blue-500 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 active:scale-95 shadow-lg dark:shadow-xl shadow-blue-500/20 dark:shadow-cyan-500/20 flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                  Mostra in Negozio
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

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
