import React, { useState, useEffect } from 'react';
import { getApiUrl } from './apiConfig';
import './index.css';

function AdminDashboard({ storeCode }) {
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [currentProduct, setCurrentProduct] = useState({
    name: '', barcode: '', category: 'LIQUIDO', subCategory: 'MINI_SHOT_10_20',
    purchasePrice: 0, retailPrice: 0, description: '', imageUrl: '', isAvailable: true,
    milliliters: 10, flavor: '', ingredients: '', nicotineStrength: 'Zero',
    color: '', batteryType: '', wattage: 0, tankCapacity: 0
  });
  const [isEditing, setIsEditing] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  // Helper di sicurezza per garantire che lo storeId sia sempre coerente
  const getCleanStoreId = () => {
    const savedStoreId = localStorage.getItem('storeId');
    if (!savedStoreId || savedStoreId === "null" || savedStoreId === "1") {
      return storeCode || "PROFESSIONAL_VAPE";
    }
    return savedStoreId;
  };

  useEffect(() => {
    if (token) {
      fetchProducts();
    }
  }, [token]);

  const fetchProducts = () => {
    const storeId = getCleanStoreId();
    // Aggiunto il prefisso /api mancante
    fetch(`${getApiUrl()}/api/products?storeId=${storeId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        if (res.status === 401 || res.status === 403) handleLogout();
        return res.json();
      })
      .then(data => setProducts(data))
      .catch(err => console.error("Error fetching products:", err));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // Aggiunto il prefisso /api alla rotta di autenticazione
      const res = await fetch(`${getApiUrl()}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (!res.ok) throw new Error('Credenziali errate o non autorizzato');
      const data = await res.json();
      
      localStorage.setItem('token', data.token);
      // Protezione immediata al login: evita di salvare stringhe nulle o ID parziali
      const finalStoreId = (!data.storeId || data.storeId === "null" || data.storeId === "1") 
        ? (storeCode || "PROFESSIONAL_VAPE") 
        : data.storeId;
        
      localStorage.setItem('storeId', finalStoreId);
      setToken(data.token);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('storeId');
    setToken(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Vuoi davvero eliminare questo prodotto?')) {
      // Aggiunto il prefisso /api alla rotta DELETE
      fetch(`${getApiUrl()}/api/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      }).then(res => {
        if (res.ok) fetchProducts();
      });
    }
  };

  const handleImageUpload = async () => {
    if (!imageFile) return null;
    const formData = new FormData();
    formData.append('file', imageFile);

    try {
      // Aggiunto il prefisso /api alla rotta di Upload
      const res = await fetch(`${getApiUrl()}/api/products/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      if (!res.ok) throw new Error('Upload fallito');
      return await res.text(); // Il backend restituisce il percorso relativo "/uploads/nomefile.png"
    } catch (err) {
      console.error(err);
      alert('Errore caricamento immagine');
      return null;
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    let uploadedImageUrl = currentProduct.imageUrl;

    if (imageFile) {
      const uploadRes = await handleImageUpload();
      if (uploadRes) uploadedImageUrl = uploadRes;
    }

    const productToSend = {
      ...currentProduct,
      imageUrl: uploadedImageUrl,
      storeId: getCleanStoreId() // Controllo e iniezione a monte dello storeId corretto
    };

    const method = isEditing ? 'PUT' : 'POST';
    // Aggiunto il prefisso /api su rotte PUT e POST
    const url = isEditing 
      ? `${getApiUrl()}/api/products/${currentProduct.instoreCode}`
      : `${getApiUrl()}/api/products`;

    fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(productToSend)
    }).then(res => {
      if (res.ok) {
        fetchProducts();
        resetForm();
      }
    });
  };

  const resetForm = () => {
    setCurrentProduct({
      name: '', barcode: '', category: 'LIQUIDO', subCategory: 'MINI_SHOT_10_20',
      purchasePrice: 0, retailPrice: 0, description: '', imageUrl: '', isAvailable: true,
      milliliters: 10, flavor: '', ingredients: '', nicotineStrength: 'Zero',
      color: '', batteryType: '', wattage: 0, tankCapacity: 0
    });
    setIsEditing(false);
    setImageFile(null);
  };

  const startEdit = (product) => {
    setCurrentProduct(product);
    setIsEditing(true);
  };

  // Funzione helper per comporre graficamente l'URL dell'anteprima immagine nell'Admin
  const renderProductImage = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path; // Vecchi record
    return `${getApiUrl()}${path}`; // Nuovi record con percorso relativo /uploads/...
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-900 text-white font-sans p-4">
        <form onSubmit={handleLogin} className="bg-zinc-800 p-8 rounded-2xl shadow-xl w-full max-w-md border border-white/5">
          <h2 className="text-2xl font-bold mb-6 text-center tracking-tight">Pannello Amministrazione</h2>
          {error && <p className="text-red-400 bg-red-500/10 border border-red-500/20 p-3 rounded-xl text-sm mb-4">{error}</p>}
          <div className="mb-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Username</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full bg-zinc-900 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500 transition-colors" required />
          </div>
          <div className="mb-6">
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-zinc-900 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500 transition-colors" required />
          </div>
          <button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-bold py-3 rounded-xl transition-all active:scale-95 shadow-lg shadow-cyan-500/20">Accedi</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans flex flex-col md:flex-row">
      {/* Sidebar / Form */}
      <div className="w-full md:w-1/3 bg-zinc-900 p-6 border-b md:border-b-0 md:border-r border-white/5 overflow-y-auto max-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-black tracking-tight">{isEditing ? 'Modifica Prodotto' : 'Nuovo Prodotto'}</h1>
          <button onClick={handleLogout} className="text-xs bg-zinc-800 hover:bg-red-500/20 hover:text-red-400 border border-white/5 px-3 py-1.5 rounded-lg transition-colors">Logout</button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">Nome Prodotto</label>
            <input type="text" value={currentProduct.name} onChange={e => setCurrentProduct({...currentProduct, name: e.target.value})} className="w-full bg-zinc-950 border border-white/10 rounded-xl p-2.5 text-sm focus:border-cyan-500 focus:outline-none" required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">Barcode</label>
              <input type="text" value={currentProduct.barcode} onChange={e => setCurrentProduct({...currentProduct, barcode: e.target.value})} className="w-full bg-zinc-950 border border-white/10 rounded-xl p-2.5 text-sm focus:border-cyan-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">Stato Visibilità</label>
              <select value={currentProduct.isAvailable} onChange={e => setCurrentProduct({...currentProduct, isAvailable: e.target.value === 'true'})} className="w-full bg-zinc-950 border border-white/10 rounded-xl p-2.5 text-sm focus:border-cyan-500 focus:outline-none">
                <option value="true">Visibile nel Catalogo</option>
                <option value="false">Nascosto</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">Prezzo d'Acquisto (€)</label>
              <input type="number" step="0.01" value={currentProduct.purchasePrice} onChange={e => setCurrentProduct({...currentProduct, purchasePrice: parseFloat(e.target.value) || 0})} className="w-full bg-zinc-950 border border-white/10 rounded-xl p-2.5 text-sm focus:border-cyan-500 focus:outline-none" required />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">Prezzo al Pubblico (€)</label>
              <input type="number" step="0.01" value={currentProduct.retailPrice} onChange={e => setCurrentProduct({...currentProduct, retailPrice: parseFloat(e.target.value) || 0})} className="w-full bg-zinc-950 border border-white/10 rounded-xl p-2.5 text-sm focus:border-cyan-500 focus:outline-none" required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">Categoria</label>
              <select value={currentProduct.category} onChange={e => setCurrentProduct({...currentProduct, category: e.target.value})} className="w-full bg-zinc-950 border border-white/10 rounded-xl p-2.5 text-sm focus:border-cyan-500 focus:outline-none">
                <option value="LIQUIDO">Liquido</option>
                <option value="HARDWARE">Hardware</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">Sottocategoria</label>
              <select value={currentProduct.subCategory} onChange={e => setCurrentProduct({...currentProduct, subCategory: e.target.value})} className="w-full bg-zinc-950 border border-white/10 rounded-xl p-2.5 text-sm focus:border-cyan-500 focus:outline-none">
                {currentProduct.category === 'LIQUIDO' ? (
                  <>
                    <option value="MINI_SHOT_10_20">Mini Shot (10+20)</option>
                    <option value="SCOMPOSTI_20_60">Scomposti (20+60)</option>
                    <option value="PRONTI_10ML">Liquidi Pronti (10ml)</option>
                    <option value="BASETTE_NICOTINA">Basette Nicotina</option>
                    <option value="AROMI_CONCENTRATI">Aromi Concentrati</option>
                    <option value="POD_PRECARICATE">Pod Precaricate</option>
                    <option value="DISPOSABLE">Usa e Getta</option>
                  </>
                ) : (
                  <>
                    <option value="POD_MOD">Pod Mod</option>
                    <option value="STARTER_KIT">Starter Kit</option>
                    <option value="BOX_MOD">Box Mod</option>
                    <option value="ATOMIZZATORI">Atomizzatori</option>
                    <option value="RESISTENZE_COIL">Resistenze / Coil</option>
                    <option value="BATTERIE_CARICATORI">Batterie / Caricatori</option>
                    <option value="ACCESSORI">Accessori</option>
                  </>
                )}
              </select>
            </div>
          </div>

          {/* Form condizionale basato sulla Categoria */}
          {currentProduct.category === 'LIQUIDO' ? (
            <div className="bg-zinc-950 p-3 rounded-xl border border-white/5 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">Millilitri (ml)</label>
                  <input type="number" value={currentProduct.milliliters} onChange={e => setCurrentProduct({...currentProduct, milliliters: parseInt(e.target.value) || 0})} className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2 text-xs text-white focus:outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">Gradazione Nicotina</label>
                  <input type="text" value={currentProduct.nicotineStrength} onChange={e => setCurrentProduct({...currentProduct, nicotineStrength: e.target.value})} className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2 text-xs text-white focus:outline-none" placeholder="Es. 4mg/ml o Zero" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">Gusto / Note Aromatiche</label>
                <input type="text" value={currentProduct.flavor} onChange={e => setCurrentProduct({...currentProduct, flavor: e.target.value})} className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2 text-xs text-white focus:outline-none" placeholder="Es. Tabacco, Vaniglia, Caramello" />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">Ingredienti / Allergeni</label>
                <input type="text" value={currentProduct.ingredients} onChange={e => setCurrentProduct({...currentProduct, ingredients: e.target.value})} className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2 text-xs text-white focus:outline-none" placeholder="Es. Glicole, Glicerina..." />
              </div>
            </div>
          ) : (
            <div className="bg-zinc-950 p-3 rounded-xl border border-white/5 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">Colore / Finitura</label>
                  <input type="text" value={currentProduct.color} onChange={e => setCurrentProduct({...currentProduct, color: e.target.value})} className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2 text-xs text-white focus:outline-none" placeholder="Es. Gunmetal, Black" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">Tipo di Batteria</label>
                  <input type="text" value={currentProduct.batteryType} onChange={e => setCurrentProduct({...currentProduct, batteryType: e.target.value})} className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2 text-xs text-white focus:outline-none" placeholder="Es. Integrata 1500mAh o 18650" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">Wattaggio Massimo (W)</label>
                  <input type="number" value={currentProduct.wattage || 0} onChange={e => setCurrentProduct({...currentProduct, wattage: parseInt(e.target.value) || 0})} className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2 text-xs text-white focus:outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">Capacità Tank (ml)</label>
                  <input type="number" step="0.1" value={currentProduct.tankCapacity || 0} onChange={e => setCurrentProduct({...currentProduct, tankCapacity: parseFloat(e.target.value) || 0})} className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2 text-xs text-white focus:outline-none" />
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">Descrizione Articolo</label>
            <textarea value={currentProduct.description} onChange={e => setCurrentProduct({...currentProduct, description: e.target.value})} className="w-full bg-zinc-950 border border-white/10 rounded-xl p-2.5 text-sm focus:border-cyan-500 focus:outline-none h-20 resize-none" />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">Immagine Prodotto</label>
            <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} className="w-full text-xs text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-zinc-800 file:text-white hover:file:bg-zinc-700" />
            {currentProduct.imageUrl && !imageFile && (
              <p className="text-[10px] text-zinc-500 mt-1 truncate">Immagine attiva: {currentProduct.imageUrl}</p>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" className="flex-1 bg-white hover:bg-zinc-200 text-black font-bold p-3 rounded-xl transition-colors text-sm">{isEditing ? 'Salva Modifiche' : 'Crea Prodotto'}</button>
            {isEditing && (
              <button type="button" onClick={resetForm} className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold p-3 rounded-xl transition-colors text-sm">Annulla</button>
            )}
          </div>
        </form>
      </div>

      {/* Main Content Area - Lista dei Prodotti caricati */}
      <div className="flex-1 p-6 overflow-y-auto max-h-screen">
        <h2 className="text-2xl font-black tracking-tight mb-6 flex items-center gap-2">
          Prodotti in Database 
          <span className="text-xs bg-zinc-800 text-zinc-400 px-2.5 py-1 rounded-full font-mono border border-white/5">{products.length} articoli</span>
        </h2>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {products.map(product => (
            <div key={product.instoreCode} className="bg-zinc-900 border border-white/5 rounded-2xl p-4 flex gap-4 hover:border-white/10 transition-colors relative group">
              <div className="w-24 h-24 bg-zinc-950 rounded-xl flex-shrink-0 flex items-center justify-center text-zinc-700 overflow-hidden border border-white/5">
                {product.imageUrl ? (
                  <img src={renderProductImage(product.imageUrl)} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <svg className="w-8 h-8 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                )}
              </div>

              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-bold text-white truncate text-base pr-6" title={product.name}>{product.name}</h3>
                    <span className={`text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full ${product.isAvailable ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/10' : 'bg-red-500/10 text-red-400 border border-red-500/10'}`}>
                      {product.isAvailable ? 'Visibile' : 'Nascosto'}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 line-clamp-1 mt-0.5">{product.description || 'Nessuna descrizione.'}</p>
                  
                  <div className="flex gap-4 mt-2 font-mono text-xs text-zinc-500">
                    <div>Cod: <span className="text-zinc-300">{product.instoreCode}</span></div>
                    {product.barcode && <div>Bc: <span className="text-zinc-300">{product.barcode}</span></div>}
                    <div>Store: <span className="text-cyan-400">{product.storeId}</span></div>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-3 pt-2 border-t border-white/5">
                  <div className="text-xs text-zinc-500">
                    Cost: <span className="text-zinc-300 mr-2">€{product.purchasePrice?.toFixed(2)}</span>
                    Vend: <span className="text-white font-bold text-sm">€{product.retailPrice?.toFixed(2)}</span>
                  </div>

                  <div className="flex gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => startEdit(product)} className="text-xs bg-zinc-800 hover:bg-white hover:text-black border border-white/5 px-2.5 py-1 rounded-lg transition-colors">Modifica</button>
                    <button onClick={() => handleDelete(product.instoreCode)} className="text-xs bg-zinc-800 hover:bg-red-500/20 hover:text-red-400 border border-white/5 px-2.5 py-1 rounded-lg transition-colors">Elimina</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;