import { Link } from 'react-router-dom';
import Header from './Header';
import { ArrowLeft } from 'lucide-react';

function CartView({ storeCode, isDarkMode, toggleTheme, storeName, settings, cart, setCart }) {

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
    <div className="min-h-screen bg-gray-50 dark:bg-[#0A0A0A] text-gray-900 dark:text-white font-sans transition-colors duration-300 flex flex-col">
      <Header 
        isDarkMode={isDarkMode} 
        toggleTheme={toggleTheme} 
        storeName={storeName} 
        settings={settings} 
        cartItemCount={cart.length}
        hideCartButton={true}
      />

      <main className="container mx-auto p-4 max-w-4xl mt-6 flex-grow">
        <div className="mb-6">
          <Link to={`/${storeCode}`} className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-white transition-colors">
            <ArrowLeft size={16} /> Torna al Catalogo
          </Link>
        </div>

        <div className="bg-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-white/5 p-6 md:p-10 rounded-3xl shadow-xl dark:shadow-2xl transition-colors duration-300">
          <h2 className="text-3xl font-extrabold mb-2 text-gray-900 dark:text-white flex items-center gap-3">
            <svg className="w-8 h-8 text-black dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
            La Tua Lista Acquisti
          </h2>
          <p className="text-gray-500 dark:text-zinc-400 mb-8 pb-6 border-b border-gray-200 dark:border-white/10 transition-colors">
            Mostra questa schermata all'operatore in negozio per completare i tuoi acquisti.
          </p>

          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 opacity-50">
              <svg className="w-20 h-20 text-gray-400 dark:text-zinc-600 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
              <p className="text-gray-500 dark:text-zinc-400 text-center text-lg font-medium">La lista è vuota.<br/>Aggiungi dei prodotti dal catalogo.</p>
              <Link to={`/${storeCode}`} className="mt-8 bg-black dark:bg-white text-white dark:text-black font-bold px-6 py-3 rounded-xl hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors">
                Esplora i prodotti
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {cart.map(item => (
                <div key={item.instoreCode} className="flex flex-col sm:flex-row justify-between sm:items-center bg-gray-50 dark:bg-[#0A0A0A]/30 p-4 md:p-6 rounded-2xl border border-gray-200 dark:border-white/5 group transition-all hover:bg-gray-100 dark:hover:bg-[#0A0A0A]/50 gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-16 h-16 bg-white dark:bg-black rounded-lg flex items-center justify-center border border-gray-200 dark:border-white/10 p-1 shrink-0">
                       <img src={item.imageUrl} alt={item.name} className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white text-lg">{item.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-gray-500 dark:text-zinc-400 font-mono">€{item.retailPrice?.toFixed(2)} cad.</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-1/3 shrink-0">
                    <div className="flex items-center bg-white dark:bg-zinc-800 rounded-xl p-1 border border-gray-200 dark:border-white/5 shadow-sm">
                      <button 
                        onClick={() => updateQuantity(item.instoreCode, item.quantity - 1)}
                        className="w-10 h-10 flex items-center justify-center bg-transparent hover:bg-gray-100 dark:hover:bg-white/10 text-gray-600 dark:text-zinc-300 rounded-lg transition-colors text-xl font-medium"
                      >
                        -
                      </button>
                      <span className="w-10 text-center font-bold text-gray-900 dark:text-white">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.instoreCode, item.quantity + 1)}
                        className="w-10 h-10 flex items-center justify-center bg-transparent hover:bg-gray-100 dark:hover:bg-white/10 text-gray-600 dark:text-zinc-300 rounded-lg transition-colors text-xl font-medium"
                      >
                        +
                      </button>
                    </div>
                    <div className="flex flex-col items-end gap-1 min-w-[80px]">
                      <span className="font-bold text-lg">€{(item.retailPrice * item.quantity).toFixed(2)}</span>
                      <button 
                        onClick={() => removeFromCart(item.instoreCode)}
                        className="text-xs uppercase font-bold text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                      >
                        Rimuovi
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {cart.length > 0 && (
            <div className="mt-10 pt-8 border-t border-gray-200 dark:border-white/10 transition-colors">
              <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                <span className="text-gray-500 dark:text-zinc-400 font-medium uppercase tracking-wider">Totale stimato</span>
                <span className="text-5xl font-black text-black dark:text-cyan-400">€{cartTotal.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default CartView;
