import { getApiUrl } from "./apiConfig";
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Sun, Moon } from 'lucide-react';

function ProductDetail({ storeCode, isDarkMode, toggleTheme, storeName, isThemeFixed }) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${getApiUrl()}/products?storeId=${storeCode}`)
      .then(res => res.json())
      .then(data => {
        const found = data.find(p => p.instoreCode.toString() === id);
        if (found) {
          setProduct(found);
        } else {
          setError("Prodotto non trovato");
        }
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-gray-50 dark:bg-black flex justify-center items-center">
       <div className="w-8 h-8 border-4 border-brand dark:border-brand border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (error || !product) return (
    <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white flex flex-col justify-center items-center">
      <h2 className="text-2xl font-bold mb-4">{error || "Errore"}</h2>
      <Link to={`/${storeCode}`} className="text-brand dark:text-brand hover:underline">Torna al catalogo</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white font-sans transition-colors duration-300">
      <header className={`${isThemeFixed ? 'bg-[#00D6EA] border-[#00b5c7]' : 'bg-white/80 dark:bg-zinc-950/80'} backdrop-blur-md border-b border-gray-200 dark:border-white/10 p-4 sticky top-0 z-10 transition-colors duration-300`}>
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link to={`/${storeCode}`} className={`p-2 rounded-full transition-colors ${isThemeFixed ? 'bg-white/20 hover:bg-white/40' : 'bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700'}`}>
              <ArrowLeft size={20} className={isThemeFixed ? "text-gray-900" : "text-gray-600 dark:text-gray-300"} />
            </Link>
            <h1 className={`text-xl font-bold tracking-tight ${isThemeFixed ? 'text-gray-900' : 'text-gray-900 dark:text-white'}`}>
              {storeName} - Dettaglio
            </h1>
          </div>
          <button onClick={toggleTheme} className={`p-2 rounded-full transition-colors ${isThemeFixed ? 'hover:bg-[#00b5c7]' : 'hover:bg-gray-200 dark:hover:bg-zinc-800'}`}>
            {isDarkMode ? <Sun size={20} className={isThemeFixed ? "text-gray-900" : "text-yellow-400"} /> : <Moon size={20} className={isThemeFixed ? "text-gray-900" : "text-brand"} />}
          </button>
        </div>
      </header>

      <main className="container mx-auto p-4 max-w-5xl mt-8">
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/5 rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row transition-colors">
          
          {/* Image Section */}
          <div className="md:w-1/2 bg-gray-100 dark:bg-zinc-800 p-8 flex items-center justify-center min-h-[400px]">
            {product.imageUrl ? (
              <img src={product.imageUrl} alt={product.name} className="max-w-full max-h-[500px] object-contain drop-shadow-2xl rounded-xl" />
            ) : (
              <div className="text-gray-400 dark:text-zinc-600 flex flex-col items-center">
                <svg className="w-24 h-24 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                <p>Nessuna immagine disponibile</p>
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="md:w-1/2 p-8 md:p-12 flex flex-col">
            <div className="mb-2 flex items-center gap-3">
              <span className="bg-brand/10 dark:bg-brand/20 text-brand dark:text-brand text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-blue-200 dark:border-brand/30">
                {product.category}
              </span>
              <span className="text-gray-500 dark:text-zinc-400 text-sm font-medium">
                {product.subCategory?.replace(/_/g, ' ')}
              </span>
            </div>
            
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4 leading-tight">{product.name}</h1>
            
            <div className="text-3xl font-black text-brand dark:text-brand mb-8 border-b border-gray-100 dark:border-white/10 pb-6">
              €{product.retailPrice?.toFixed(2)}
            </div>

            <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-zinc-300 mb-8 leading-relaxed">
              <p>{product.description || "Nessuna descrizione disponibile per questo prodotto."}</p>
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-4 mb-8 bg-gray-50 dark:bg-black/30 p-6 rounded-2xl border border-gray-100 dark:border-white/5">
              <div className="flex flex-col"><span className="text-xs text-gray-500 dark:text-zinc-500 uppercase font-bold tracking-wider mb-1">Codice / Barcode</span><span className="font-mono text-gray-800 dark:text-zinc-200">{product.barcode || product.instoreCode}</span></div>
              
              {product.category === 'LIQUIDO' ? (
                <>
                  {product.milliliters && <div className="flex flex-col"><span className="text-xs text-gray-500 dark:text-zinc-500 uppercase font-bold tracking-wider mb-1">Formato</span><span className="text-gray-800 dark:text-zinc-200">{product.milliliters} ml</span></div>}
                  {product.flavor && <div className="flex flex-col"><span className="text-xs text-gray-500 dark:text-zinc-500 uppercase font-bold tracking-wider mb-1">Gusto Principale</span><span className="text-gray-800 dark:text-zinc-200">{product.flavor}</span></div>}
                  {product.nicotineStrength && <div className="flex flex-col"><span className="text-xs text-gray-500 dark:text-zinc-500 uppercase font-bold tracking-wider mb-1">Nicotina</span><span className="text-gray-800 dark:text-zinc-200">{product.nicotineStrength}</span></div>}
                  {product.ingredients && <div className="flex flex-col col-span-2 mt-2"><span className="text-xs text-gray-500 dark:text-zinc-500 uppercase font-bold tracking-wider mb-1">Ingredienti Dettagliati</span><span className="text-gray-800 dark:text-zinc-200">{product.ingredients}</span></div>}
                </>
              ) : (
                <>
                  {product.color && <div className="flex flex-col"><span className="text-xs text-gray-500 dark:text-zinc-500 uppercase font-bold tracking-wider mb-1">Colore</span><span className="text-gray-800 dark:text-zinc-200">{product.color}</span></div>}
                  {product.batteryType && <div className="flex flex-col"><span className="text-xs text-gray-500 dark:text-zinc-500 uppercase font-bold tracking-wider mb-1">Batteria</span><span className="text-gray-800 dark:text-zinc-200">{product.batteryType}</span></div>}
                  {product.wattage > 0 && <div className="flex flex-col"><span className="text-xs text-gray-500 dark:text-zinc-500 uppercase font-bold tracking-wider mb-1">Potenza Max</span><span className="text-gray-800 dark:text-zinc-200">{product.wattage} W</span></div>}
                  {product.tankCapacity > 0 && <div className="flex flex-col"><span className="text-xs text-gray-500 dark:text-zinc-500 uppercase font-bold tracking-wider mb-1">Capacità Tank</span><span className="text-gray-800 dark:text-zinc-200">{product.tankCapacity} ml</span></div>}
                </>
              )}
            </div>

            <div className="mt-auto">
               <Link to={`/${storeCode}`} className="w-full flex items-center justify-center gap-3 bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-black font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg">
                 <ShoppingCart size={20} />
                 Torna alla vetrina per aggiungere al carrello
               </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ProductDetail;
