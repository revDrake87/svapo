import { useState, useEffect } from 'react';
import './index.css';

import { Link } from 'react-router-dom';

function CustomerView() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <header className="bg-zinc-950/80 backdrop-blur-md border-b border-white/10 text-white p-4 sticky top-0 z-10 transition-all duration-300">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-extrabold tracking-tight text-white">
            VapeStore
          </h1>
          <div className="flex items-center space-x-4">
            <Link to="/admin" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Admin Area</Link>
            <span className="bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-1.5 rounded-full text-sm font-semibold transition-all hover:bg-white/20">
              Lista Acquisto: {cart.length} {cart.length === 1 ? 'articolo' : 'articoli'}
            </span>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 flex flex-col md:flex-row gap-8 mt-6">
        {/* Catalog Section */}
        <div className="md:w-2/3">
          <h2 className="text-3xl font-bold mb-6 text-white tracking-tight">Catalogo</h2>
          
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

          {/* Placeholder for products if backend is down, just for demonstration */}
          {products.length === 0 && !loading && (
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
               {[
                 { instoreCode: 1, barcode: "805123", name: "Menta Glaciale 10ml", description: "Liquido pronto all'uso", retailPrice: 5.90, category: "LIQUIDO", subCategory: "TPD", flavor: "Menta", nicotineStrength: "4mg/ml", milliliters: 10 },
                 { instoreCode: 2, barcode: "805124", name: "Tabacco Secco Mini", description: "Aroma concentrato scomposto", retailPrice: 12.90, category: "LIQUIDO", subCategory: "MINI_SHOT_10_10", flavor: "Tabacco", nicotineStrength: null, milliliters: 10 },
                 { instoreCode: 3, barcode: "805125", name: "Aroma Fragola 10ml", description: "Aroma puro da diluire", retailPrice: 6.00, category: "LIQUIDO", subCategory: "AROMA", flavor: "Fragola", nicotineStrength: null, milliliters: 10 },
                 { instoreCode: 4, barcode: "805126", name: "Nicotina Base 10ml", description: "Shot di nicotina neutra", retailPrice: 2.50, category: "LIQUIDO", subCategory: "NICOTINE_SHOT", flavor: null, nicotineStrength: "18mg/ml", milliliters: 10 }
               ].map(product => (
                 <div key={product.instoreCode} className="group bg-zinc-900 border border-white/5 p-5 rounded-2xl shadow-xl hover:shadow-cyan-500/10 transition-all duration-300 ease-out hover:-translate-y-1 flex flex-col relative overflow-hidden">
                    <div className="absolute top-3 right-3 bg-white/10 backdrop-blur-md border border-white/10 text-white text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full z-10">
                      {product.subCategory?.replace(/_/g, ' ')}
                    </div>
                    <div className="h-48 bg-zinc-800 rounded-xl mb-5 flex items-center justify-center text-zinc-600 mt-2 transition-transform duration-500 group-hover:scale-105">
                      <svg className="w-12 h-12 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">{product.name}</h3>
                    <p className="text-sm text-zinc-400 mb-4 line-clamp-2">{product.description}</p>
                    
                    <div className="bg-black/40 rounded-xl p-3 mb-5 flex-grow text-xs space-y-1.5 border border-white/5">
                      <div className="flex justify-between text-zinc-300"><span className="text-zinc-500 font-medium">Codice:</span> <span>{product.barcode || product.instoreCode}</span></div>
                      {product.milliliters && <div className="flex justify-between text-zinc-300"><span className="text-zinc-500 font-medium">Quantità:</span> <span>{product.milliliters}ml</span></div>}
                      {product.flavor && <div className="flex justify-between text-zinc-300"><span className="text-zinc-500 font-medium">Gusto:</span> <span>{product.flavor}</span></div>}
                      {product.nicotineStrength && <div className="flex justify-between text-zinc-300"><span className="text-zinc-500 font-medium">Nicotina:</span> <span>{product.nicotineStrength}</span></div>}
                    </div>

                    <div className="flex justify-between items-center mt-auto pt-2 border-t border-white/5">
                      <span className="text-2xl font-black text-white">€{product.retailPrice?.toFixed(2)}</span>
                      <button 
                        onClick={() => addToCart(product)}
                        className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-5 py-2.5 rounded-xl transition-all duration-300 active:scale-95 shadow-lg shadow-cyan-500/20"
                      >
                        Aggiungi
                      </button>
                    </div>
                 </div>
               ))}
             </div>
          )}

          {products.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => (
                <div key={product.instoreCode} className="group bg-zinc-900 border border-white/5 p-5 rounded-2xl shadow-xl hover:shadow-cyan-500/10 transition-all duration-300 ease-out hover:-translate-y-1 flex flex-col relative overflow-hidden">
                  <div className="absolute top-3 right-3 bg-white/10 backdrop-blur-md border border-white/10 text-white text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full z-10">
                    {product.subCategory?.replace(/_/g, ' ')}
                  </div>
                  <div className="h-48 bg-zinc-800 rounded-xl mb-5 flex items-center justify-center text-zinc-600 overflow-hidden mt-2 transition-transform duration-500 group-hover:scale-105">
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.name} className="object-cover h-full w-full" />
                    ) : (
                      <svg className="w-12 h-12 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">{product.name}</h3>
                  <p className="text-sm text-zinc-400 mb-4 line-clamp-2">{product.description}</p>
                  
                  <div className="bg-black/40 rounded-xl p-3 mb-5 flex-grow text-xs space-y-1.5 border border-white/5">
                    <div className="flex justify-between text-zinc-300"><span className="text-zinc-500 font-medium">Codice:</span> <span>{product.barcode || product.instoreCode}</span></div>
                    
                    {product.category === 'LIQUIDO' ? (
                      <>
                        {product.milliliters && <div className="flex justify-between text-zinc-300"><span className="text-zinc-500 font-medium">Quantità:</span> <span>{product.milliliters}ml</span></div>}
                        {product.flavor && <div className="flex justify-between text-zinc-300"><span className="text-zinc-500 font-medium">Gusto:</span> <span>{product.flavor}</span></div>}
                        {product.nicotineStrength && <div className="flex justify-between text-zinc-300"><span className="text-zinc-500 font-medium">Nicotina:</span> <span>{product.nicotineStrength}</span></div>}
                      </>
                    ) : (
                      <>
                        {product.color && <div className="flex justify-between text-zinc-300"><span className="text-zinc-500 font-medium">Colore:</span> <span>{product.color}</span></div>}
                        {product.batteryType && <div className="flex justify-between text-zinc-300"><span className="text-zinc-500 font-medium">Batteria:</span> <span>{product.batteryType}</span></div>}
                        {product.wattage > 0 && <div className="flex justify-between text-zinc-300"><span className="text-zinc-500 font-medium">Wattaggio Max:</span> <span>{product.wattage}W</span></div>}
                        {product.tankCapacity > 0 && <div className="flex justify-between text-zinc-300"><span className="text-zinc-500 font-medium">Capacità Tank:</span> <span>{product.tankCapacity}ml</span></div>}
                      </>
                    )}
                  </div>

                  <div className="flex justify-between items-center mt-auto pt-2 border-t border-white/5">
                    <span className="text-2xl font-black text-white">€{product.retailPrice?.toFixed(2)}</span>
                    <button 
                      onClick={() => addToCart(product)}
                      className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-5 py-2.5 rounded-xl transition-all duration-300 active:scale-95 shadow-lg shadow-cyan-500/20"
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
          <div className="bg-zinc-900 border border-white/5 p-6 rounded-2xl shadow-2xl sticky top-28">
            <h2 className="text-2xl font-bold mb-2 text-white flex items-center gap-2">
              <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
              Lista Acquisto
            </h2>
            <p className="text-sm text-zinc-400 mb-6 pb-4 border-b border-white/10">
              Mostra questa schermata in negozio.
            </p>

            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 opacity-50">
                <svg className="w-16 h-16 text-zinc-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
                <p className="text-zinc-500 text-center text-sm">La lista è vuota.<br/>Aggiungi dei prodotti dal catalogo.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                {cart.map(item => (
                  <div key={item.instoreCode} className="flex justify-between items-center bg-black/30 p-3 rounded-xl border border-white/5 group transition-all hover:bg-black/50">
                    <div className="flex-1">
                      <h4 className="font-bold text-white text-sm line-clamp-1">{item.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-zinc-400 font-mono">€{item.retailPrice?.toFixed(2)} cad.</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 ml-4">
                      <div className="flex items-center bg-zinc-800 rounded-lg p-0.5 border border-white/5">
                        <button 
                          onClick={() => updateQuantity(item.instoreCode, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center bg-transparent hover:bg-white/10 text-zinc-300 rounded-md transition-colors"
                        >
                          -
                        </button>
                        <span className="w-6 text-center text-sm font-bold text-white">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.instoreCode, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center bg-transparent hover:bg-white/10 text-zinc-300 rounded-md transition-colors"
                        >
                          +
                        </button>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.instoreCode)}
                        className="text-[10px] uppercase font-bold text-red-400 hover:text-red-300 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        Rimuovi
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {cart.length > 0 && (
              <div className="mt-6 pt-5 border-t border-white/10">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-zinc-400 font-medium uppercase text-sm tracking-wider">Totale stimato</span>
                  <span className="text-3xl font-black text-cyan-400">€{cartTotal.toFixed(2)}</span>
                </div>
                <button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 active:scale-95 shadow-xl shadow-cyan-500/20 flex items-center justify-center gap-2">
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
