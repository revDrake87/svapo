import React, { useState, useEffect } from 'react';
import { getApiUrl } from './apiConfig';
import './index.css';

function CustomerView({ storeCode }) {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [subCategoryFilter, setSubCategoryFilter] = useState('ALL');

  useEffect(() => {
    // RIMOSSO /api (incluso in getApiUrl)
    fetch(`${getApiUrl()}/products?storeId=${storeCode}`)
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error("Error fetching products:", err));
  }, [storeCode]);

  const renderProductImage = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path; 
    // Rimuove /api dall'URL assoluto per caricare la cartella /uploads
    const baseUrl = getApiUrl().replace('/api', '');
    return `${baseUrl}${path}`;
  };

  const filteredProducts = products.filter(product => {
    if (product.isAvailable === false) return false;

    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.flavor?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'ALL' || product.category === categoryFilter;
    const matchesSubCategory = subCategoryFilter === 'ALL' || product.subCategory === subCategoryFilter;

    return matchesSearch && matchesCategory && matchesSubCategory;
  });

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans flex flex-col antialiased">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-zinc-900/80 backdrop-blur-md border-b border-white/5 px-4 md:px-8 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-cyan-500 rounded-xl flex items-center justify-center font-black text-black text-xl shadow-lg shadow-cyan-500/20">S</div>
          <div>
            <h1 className="text-lg font-black tracking-tight uppercase">Digital Catalog</h1>
            <p className="text-[10px] text-zinc-400 font-mono tracking-wider -mt-0.5">{storeCode}</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="w-full sm:w-80 relative">
          <input 
            type="text" 
            placeholder="Cerca prodotto, aroma, marchio..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-950 border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
          <svg className="w-4 h-4 absolute left-3.5 top-3 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Navigation / Filters Sidebar */}
        <aside className="w-full md:w-64 bg-zinc-900/40 border-b md:border-b-0 md:border-r border-white/5 p-6 space-y-6 overflow-y-auto">
          <div>
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-3">Macro Categorie</h2>
            <div className="space-y-1">
              {['ALL', 'LIQUIDO', 'HARDWARE'].map(cat => (
                <button
                  key={cat}
                  onClick={() => { setCategoryFilter(cat); setSubCategoryFilter('ALL'); }}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${categoryFilter === cat ? 'bg-cyan-500 text-black font-bold shadow-lg shadow-cyan-500/10' : 'text-zinc-400 hover:bg-white/5 hover:text-white'}`}
                >
                  {cat === 'ALL' ? 'Tutti i Prodotti' : cat.charAt(0) + cat.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Subcategories (Conditional) */}
          <div>
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-3">Filtro Specifico</h2>
            <div className="space-y-1">
              <button 
                onClick={() => setSubCategoryFilter('ALL')}
                className={`w-full text-left px-4 py-2 rounded-lg text-xs font-medium transition-colors ${subCategoryFilter === 'ALL' ? 'text-cyan-400 font-bold' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                Tutte le sottocategorie
              </button>
              {categoryFilter === 'LIQUIDO' && (
                <>
                  <option onClick={() => setSubCategoryFilter('MINI_SHOT_10_20')} className={`cursor-pointer p-2 text-xs rounded-lg ${subCategoryFilter === 'MINI_SHOT_10_20' ? 'bg-white/5 text-white' : 'text-zinc-400'}`}>Mini Shot (10+20)</option>
                  <option onClick={() => setSubCategoryFilter('SCOMPOSTI_20_60')} className={`cursor-pointer p-2 text-xs rounded-lg ${subCategoryFilter === 'SCOMPOSTI_20_60' ? 'bg-white/5 text-white' : 'text-zinc-400'}`}>Scomposti (20+60)</option>
                  <option onClick={() => setSubCategoryFilter('PRONTI_10ML')} className={`cursor-pointer p-2 text-xs rounded-lg ${subCategoryFilter === 'PRONTI_10ML' ? 'bg-white/5 text-white' : 'text-zinc-400'}`}>Liquidi Pronti (10ml)</option>
                  <option onClick={() => setSubCategoryFilter('BASETTE_NICOTINA')} className={`cursor-pointer p-2 text-xs rounded-lg ${subCategoryFilter === 'BASETTE_NICOTINA' ? 'bg-white/5 text-white' : 'text-zinc-400'}`}>Basette Nicotina</option>
                  <option onClick={() => setSubCategoryFilter('AROMI_CONCENTRATI')} className={`cursor-pointer p-2 text-xs rounded-lg ${subCategoryFilter === 'AROMI_CONCENTRATI' ? 'bg-white/5 text-white' : 'text-zinc-400'}`}>Aromi Concentrati</option>
                  <option onClick={() => setSubCategoryFilter('DISPOSABLE')} className={`cursor-pointer p-2 text-xs rounded-lg ${subCategoryFilter === 'DISPOSABLE' ? 'bg-white/5 text-white' : 'text-zinc-400'}`}>Usa e Getta</option>
                </>
              )}
              {categoryFilter === 'HARDWARE' && (
                <>
                  <option onClick={() => setSubCategoryFilter('POD_MOD')} className={`cursor-pointer p-2 text-xs rounded-lg ${subCategoryFilter === 'POD_MOD' ? 'bg-white/5 text-white' : 'text-zinc-400'}`}>Pod Mod</option>
                  <option onClick={() => setSubCategoryFilter('STARTER_KIT')} className={`cursor-pointer p-2 text-xs rounded-lg ${subCategoryFilter === 'STARTER_KIT' ? 'bg-white/5 text-white' : 'text-zinc-400'}`}>Starter Kit</option>
                  <option onClick={() => setSubCategoryFilter('BOX_MOD')} className={`cursor-pointer p-2 text-xs rounded-lg ${subCategoryFilter === 'BOX_MOD' ? 'bg-white/5 text-white' : 'text-zinc-400'}`}>Box Mod</option>
                  <option onClick={() => setSubCategoryFilter('ATOMIZZATORI')} className={`cursor-pointer p-2 text-xs rounded-lg ${subCategoryFilter === 'ATOMIZZATORI' ? 'bg-white/5 text-white' : 'text-zinc-400'}`}>Atomizzatori</option>
                  <option onClick={() => setSubCategoryFilter('RESISTENZE_COIL')} className={`cursor-pointer p-2 text-xs rounded-lg ${subCategoryFilter === 'RESISTENZE_COIL' ? 'bg-white/5 text-white' : 'text-zinc-400'}`}>Resistenze / Coil</option>
                </>
              )}
            </div>
          </div>
        </aside>

        {/* Product Grid Area */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto bg-zinc-950">
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.map(product => (
              <div 
                key={product.instoreCode}
                onClick={() => setSelectedProduct(product)}
                className="bg-zinc-900 border border-white/5 rounded-2xl p-3 md:p-4 flex flex-col justify-between hover:border-white/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer group"
              >
                <div>
                  <div className="aspect-square bg-zinc-950 rounded-xl mb-4 overflow-hidden flex items-center justify-center border border-white/5 relative">
                    {product.imageUrl ? (
                      <img src={renderProductImage(product.imageUrl)} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <svg className="w-12 h-12 text-zinc-800 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    )}
                  </div>
                  <h3 className="font-bold text-sm md:text-base text-zinc-100 line-clamp-2 leading-tight group-hover:text-white transition-colors" title={product.name}>{product.name}</h3>
                  <p className="text-[11px] text-zinc-500 font-medium tracking-wide uppercase mt-1">{product.subCategory.replace(/_/g, ' ')}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-baseline">
                  <span className="text-[10px] text-zinc-500 font-mono">Cod: {product.instoreCode}</span>
                  <span className="text-base md:text-lg font-black text-white">€{product.retailPrice.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4" onClick={() => setSelectedProduct(null)}>
          <div className="bg-zinc-900 border border-white/10 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 bg-zinc-950/40 hover:bg-white/10 text-zinc-400 hover:text-white p-2 rounded-full transition-colors z-10">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>

            <div className="flex flex-col md:flex-row h-full">
              <div className="w-full md:w-1/2 bg-zinc-950 flex items-center justify-center p-6 border-b md:border-b-0 md:border-r border-white/5 aspect-square md:aspect-auto">
                {selectedProduct.imageUrl ? (
                  <img src={renderProductImage(selectedProduct.imageUrl)} alt={selectedProduct.name} className="max-w-full max-h-[320px] object-contain rounded-xl" />
                ) : (
                  <svg className="w-20 h-20 text-zinc-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                )}
              </div>

              <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto max-h-[400px] md:max-h-[480px]">
                <div>
                  <span className="text-[10px] uppercase font-black tracking-widest bg-cyan-500/10 text-cyan-400 px-2.5 py-1 rounded-full border border-cyan-500/10">{selectedProduct.category}</span>
                  <h2 className="text-xl font-black text-white mt-3 leading-tight">{selectedProduct.name}</h2>
                  <p className="text-xs text-zinc-400 font-mono mt-1">Sottocategoria: {selectedProduct.subCategory.replace(/_/g, ' ')}</p>
                  <p className="text-sm text-zinc-300 mt-4 leading-relaxed font-normal">{selectedProduct.description || 'Nessuna descrizione disponibile per questo articolo.'}</p>
                  
                  {/* Specific Details based on Category */}
                  {selectedProduct.category === 'LIQUIDO' ? (
                    <div className="mt-6 space-y-2 text-xs bg-zinc-950/50 border border-white/5 p-4 rounded-xl font-normal">
                      {selectedProduct.flavor && <div><span className="text-zinc-500 font-semibold">Note Aromatiche:</span> <span className="text-zinc-200">{selectedProduct.flavor}</span></div>}
                      {selectedProduct.milliliters && <div><span className="text-zinc-500 font-semibold">Volume Liquido:</span> <span className="text-zinc-200">{selectedProduct.milliliters}ml</span></div>}
                      {selectedProduct.nicotineStrength && <div><span className="text-zinc-500 font-semibold">Nicotina:</span> <span className="text-zinc-200">{selectedProduct.nicotineStrength}</span></div>}
                    </div>
                  ) : (
                    <div className="mt-6 space-y-2 text-xs bg-zinc-950/50 border border-white/5 p-4 rounded-xl font-normal">
                      {selectedProduct.color && <div><span className="text-zinc-500 font-semibold">Finitura / Colore:</span> <span className="text-zinc-200">{selectedProduct.color}</span></div>}
                      {selectedProduct.batteryType && <div><span className="text-zinc-500 font-semibold">Alimentazione:</span> <span className="text-zinc-200">{selectedProduct.batteryType}</span></div>}
                      {selectedProduct.wattage > 0 && <div><span className="text-zinc-500 font-semibold">Potenza Erogata:</span> <span className="text-zinc-200">{selectedProduct.wattage}W</span></div>}
                    </div>
                  )}
                </div>

                <div className="mt-8 pt-4 border-t border-white/5 flex justify-between items-baseline">
                  <span className="text-xs text-zinc-500 font-mono">In-Store Code: #{selectedProduct.instoreCode}</span>
                  <div className="text-2xl font-black text-cyan-400">€{selectedProduct.retailPrice.toFixed(2)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomerView;