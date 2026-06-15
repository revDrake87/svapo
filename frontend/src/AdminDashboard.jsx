import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, Image as ImageIcon, Save, X, LogOut } from 'lucide-react';

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    fetch('http://localhost:8080/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch products", err);
        setLoading(false);
      });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'admin123') { // Mock authentication
      setIsAuthenticated(true);
    } else {
      alert('Password errata. Hint: admin123');
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Sei sicuro di voler eliminare questo prodotto?')) {
      fetch(`http://localhost:8080/api/products/${id}`, { method: 'DELETE' })
        .then(() => fetchProducts())
        .catch(err => console.error("Failed to delete", err));
    }
  };

  const handleEdit = (product) => {
    setCurrentProduct(product);
    setIsEditing(true);
  };

  const handleAddNew = () => {
    setCurrentProduct({
      category: 'LIQUIDO',
      subCategory: 'TPD',
      name: '',
      barcode: '',
      description: '',
      retailPrice: 0,
      purchasePrice: 0,
      milliliters: 10,
      flavor: '',
      nicotineStrength: '',
      imageUrl: '',
      color: '',
      batteryType: '',
      wattage: '',
      tankCapacity: ''
    });
    setIsEditing(true);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append('file', file);

    fetch('http://localhost:8080/api/products/upload', {
      method: 'POST',
      body: formData,
    })
      .then(res => res.text())
      .then(url => {
        setCurrentProduct({ ...currentProduct, imageUrl: url });
        setUploadingImage(false);
      })
      .catch(err => {
        console.error("Upload failed", err);
        setUploadingImage(false);
        alert('Upload fallito');
      });
  };

  const handleSave = (e) => {
    e.preventDefault();
    const method = currentProduct.instoreCode ? 'PUT' : 'POST';
    const url = currentProduct.instoreCode 
      ? `http://localhost:8080/api/products/${currentProduct.instoreCode}`
      : 'http://localhost:8080/api/products';

    fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(currentProduct)
    })
      .then(() => {
        setIsEditing(false);
        fetchProducts();
      })
      .catch(err => console.error("Failed to save", err));
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center font-sans text-gray-200">
        <form onSubmit={handleLogin} className="bg-zinc-900 p-8 rounded-2xl shadow-xl border border-white/10 w-96">
          <h2 className="text-2xl font-bold text-center mb-6 text-white">Area Riservata Admin</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-zinc-400 mb-2">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500 transition-colors"
              required
            />
          </div>
          <button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-2 rounded-lg transition-colors">
            Accedi
          </button>
          <div className="mt-4 text-center">
            <Link to="/" className="text-zinc-500 text-sm hover:text-white transition-colors">Torna al catalogo</Link>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-gray-200 font-sans">
      <header className="bg-zinc-950 border-b border-white/10 text-white p-4 sticky top-0 z-20">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
          <div className="flex gap-4 items-center">
            <Link to="/" className="text-zinc-400 hover:text-white text-sm transition-colors">Vetrina Pubblica</Link>
            <button onClick={() => setIsAuthenticated(false)} className="flex items-center gap-2 text-red-400 hover:text-red-300 text-sm">
              <LogOut size={16} /> Esci
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 mt-6">
        {isEditing ? (
          <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 shadow-xl max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
              <h2 className="text-2xl font-bold text-white">
                {currentProduct.instoreCode ? 'Modifica Prodotto' : 'Nuovo Prodotto'}
              </h2>
              <button onClick={() => setIsEditing(false)} className="text-zinc-400 hover:text-white"><X size={24} /></button>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Dati Base */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-cyan-400 border-b border-white/5 pb-2">Informazioni Base</h3>
                  
                  <div>
                    <label className="block text-sm text-zinc-400 mb-1">Categoria</label>
                    <select 
                      value={currentProduct.category} 
                      onChange={e => setCurrentProduct({...currentProduct, category: e.target.value, subCategory: e.target.value === 'LIQUIDO' ? 'TPD' : 'BATTERY_BOX'})}
                      className="w-full bg-black border border-white/20 rounded px-3 py-2 text-white focus:border-cyan-500 outline-none"
                    >
                      <option value="LIQUIDO">Liquido</option>
                      <option value="HARDWARE">Hardware</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-zinc-400 mb-1">Sotto-Categoria</label>
                    {currentProduct.category === 'LIQUIDO' ? (
                      <select 
                        value={currentProduct.subCategory || 'TPD'} 
                        onChange={e => setCurrentProduct({...currentProduct, subCategory: e.target.value})}
                        className="w-full bg-black border border-white/20 rounded px-3 py-2 text-white focus:border-cyan-500 outline-none"
                      >
                        <option value="TPD">TPD 10ml</option>
                        <option value="MINI_SHOT_10_10">Mini Shot 10+10</option>
                        <option value="SHOT">Shot</option>
                        <option value="AROMA">Aroma</option>
                        <option value="NICOTINE_SHOT">Base/Nicotina 10ml</option>
                      </select>
                    ) : (
                      <select 
                        value={currentProduct.subCategory || 'BATTERY_BOX'} 
                        onChange={e => setCurrentProduct({...currentProduct, subCategory: e.target.value})}
                        className="w-full bg-black border border-white/20 rounded px-3 py-2 text-white focus:border-cyan-500 outline-none"
                      >
                        <option value="BATTERY_BOX">Battery Box</option>
                        <option value="ATOMIZER_RTA">Atomizzatore Rigenerabile</option>
                        <option value="ATOMIZER_NON_RTA">Atomizzatore Non Rigenerabile</option>
                        <option value="STARTER_KIT">Starter Kit</option>
                        <option value="POD_MOD">PodMod Starter Kit</option>
                        <option value="POD_ACCESSORY">Accessori Ricambio PodMod</option>
                        <option value="ACCESSORY">Accessori Vari</option>
                      </select>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm text-zinc-400 mb-1">Nome Prodotto</label>
                    <input type="text" required value={currentProduct.name} onChange={e => setCurrentProduct({...currentProduct, name: e.target.value})} className="w-full bg-black border border-white/20 rounded px-3 py-2 text-white focus:border-cyan-500 outline-none" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-zinc-400 mb-1">Barcode</label>
                      <input type="text" value={currentProduct.barcode || ''} onChange={e => setCurrentProduct({...currentProduct, barcode: e.target.value})} className="w-full bg-black border border-white/20 rounded px-3 py-2 text-white focus:border-cyan-500 outline-none" />
                    </div>
                    {currentProduct.category === 'LIQUIDO' && (
                      <div>
                        <label className="block text-sm text-zinc-400 mb-1">Millilitri (ml)</label>
                        <input type="number" value={currentProduct.milliliters || ''} onChange={e => setCurrentProduct({...currentProduct, milliliters: e.target.value})} className="w-full bg-black border border-white/20 rounded px-3 py-2 text-white focus:border-cyan-500 outline-none" />
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-zinc-400 mb-1">Prezzo Acquisto (€)</label>
                      <input type="number" step="0.01" value={currentProduct.purchasePrice || 0} onChange={e => setCurrentProduct({...currentProduct, purchasePrice: parseFloat(e.target.value)})} className="w-full bg-black border border-white/20 rounded px-3 py-2 text-white focus:border-cyan-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm text-zinc-400 mb-1">Prezzo Pubblico (€)</label>
                      <input type="number" step="0.01" required value={currentProduct.retailPrice || 0} onChange={e => setCurrentProduct({...currentProduct, retailPrice: parseFloat(e.target.value)})} className="w-full bg-black border border-white/20 rounded px-3 py-2 text-white focus:border-cyan-500 outline-none" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm text-zinc-400 mb-1">Descrizione</label>
                    <textarea rows="3" value={currentProduct.description || ''} onChange={e => setCurrentProduct({...currentProduct, description: e.target.value})} className="w-full bg-black border border-white/20 rounded px-3 py-2 text-white focus:border-cyan-500 outline-none" />
                  </div>
                </div>

                {/* Specifiche Dinamiche & Immagine */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white border-b border-white/5 pb-2">
                    {currentProduct.category === 'LIQUIDO' ? 'Specifiche Liquido' : 'Specifiche Hardware'}
                  </h3>

                  {currentProduct.category === 'LIQUIDO' ? (
                    <>
                      <div>
                        <label className="block text-sm text-zinc-400 mb-1">Gusto Principale</label>
                        <input type="text" placeholder="es. Menta, Tabacco" value={currentProduct.flavor || ''} onChange={e => setCurrentProduct({...currentProduct, flavor: e.target.value})} className="w-full bg-black border border-white/20 rounded px-3 py-2 text-white focus:border-cyan-500 outline-none" />
                      </div>
                      <div>
                        <label className="block text-sm text-zinc-400 mb-1">Ingredienti (separati da virgola)</label>
                        <input type="text" placeholder="es. Menta, Ghiaccio, Limone" value={currentProduct.ingredients || ''} onChange={e => setCurrentProduct({...currentProduct, ingredients: e.target.value})} className="w-full bg-black border border-white/20 rounded px-3 py-2 text-white focus:border-cyan-500 outline-none" />
                      </div>
                      <div>
                        <label className="block text-sm text-zinc-400 mb-1">Gradazione Nicotina</label>
                        <input type="text" placeholder="es. 4mg/ml, Zero" value={currentProduct.nicotineStrength || ''} onChange={e => setCurrentProduct({...currentProduct, nicotineStrength: e.target.value})} className="w-full bg-black border border-white/20 rounded px-3 py-2 text-white focus:border-cyan-500 outline-none" />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-zinc-400 mb-1">Colore</label>
                          <input type="text" value={currentProduct.color || ''} onChange={e => setCurrentProduct({...currentProduct, color: e.target.value})} className="w-full bg-black border border-white/20 rounded px-3 py-2 text-white focus:border-cyan-500 outline-none" />
                        </div>
                        <div>
                          <label className="block text-sm text-zinc-400 mb-1">Wattaggio Max (W)</label>
                          <input type="number" value={currentProduct.wattage || ''} onChange={e => setCurrentProduct({...currentProduct, wattage: parseInt(e.target.value)})} className="w-full bg-black border border-white/20 rounded px-3 py-2 text-white focus:border-cyan-500 outline-none" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm text-zinc-400 mb-1">Tipo Batteria</label>
                        <input type="text" placeholder="es. Integrata 1000mAh, 18650" value={currentProduct.batteryType || ''} onChange={e => setCurrentProduct({...currentProduct, batteryType: e.target.value})} className="w-full bg-black border border-white/20 rounded px-3 py-2 text-white focus:border-cyan-500 outline-none" />
                      </div>
                      <div>
                        <label className="block text-sm text-zinc-400 mb-1">Capacità Tank (ml)</label>
                        <input type="number" step="0.1" value={currentProduct.tankCapacity || ''} onChange={e => setCurrentProduct({...currentProduct, tankCapacity: parseFloat(e.target.value)})} className="w-full bg-black border border-white/20 rounded px-3 py-2 text-white focus:border-cyan-500 outline-none" />
                      </div>
                    </>
                  )}

                  <h3 className="text-lg font-semibold text-emerald-400 border-b border-white/5 pb-2 mt-6">Immagine</h3>
                  
                  <div className="flex gap-4 items-start">
                    <div className="w-32 h-32 bg-black border border-white/20 rounded-xl overflow-hidden flex items-center justify-center shrink-0">
                      {currentProduct.imageUrl ? (
                        <img src={currentProduct.imageUrl} alt="preview" className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="text-zinc-600" size={32} />
                      )}
                    </div>
                    <div className="flex-1 space-y-2">
                      <label className="block text-sm text-zinc-400 mb-1">Carica nuova immagine</label>
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploadingImage}
                        className="w-full text-sm text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-500/10 file:text-emerald-400 hover:file:bg-emerald-500/20"
                      />
                      {uploadingImage && <p className="text-xs text-emerald-400 animate-pulse">Caricamento in corso...</p>}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-6 border-t border-white/10">
                <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors">Annulla</button>
                <button type="submit" className="px-6 py-2 rounded-lg bg-cyan-500 text-black font-bold hover:bg-cyan-400 transition-colors flex items-center gap-2">
                  <Save size={18} /> Salva Prodotto
                </button>
              </div>
            </form>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Prodotti a Catalogo</h2>
              <button onClick={handleAddNew} className="bg-cyan-500 text-black font-bold px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-cyan-400 transition-colors">
                <Plus size={18} /> Aggiungi Nuovo
              </button>
            </div>

            {loading ? (
              <p>Caricamento...</p>
            ) : (
              <div className="bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-black/50 border-b border-white/10">
                      <th className="p-4 text-xs uppercase text-zinc-500 font-bold">Img</th>
                      <th className="p-4 text-xs uppercase text-zinc-500 font-bold">Codice</th>
                      <th className="p-4 text-xs uppercase text-zinc-500 font-bold">Nome</th>
                      <th className="p-4 text-xs uppercase text-zinc-500 font-bold">Categoria</th>
                      <th className="p-4 text-xs uppercase text-zinc-500 font-bold">Prezzo</th>
                      <th className="p-4 text-xs uppercase text-zinc-500 font-bold text-right">Azioni</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(p => (
                      <tr key={p.instoreCode} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="p-4">
                          <div className="w-10 h-10 bg-black rounded-md flex items-center justify-center overflow-hidden">
                            {p.imageUrl ? <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" /> : <ImageIcon size={16} className="text-zinc-600" />}
                          </div>
                        </td>
                        <td className="p-4 text-sm font-mono text-zinc-400">{p.instoreCode}</td>
                        <td className="p-4 font-bold text-white">{p.name}</td>
                        <td className="p-4">
                          <span className="bg-zinc-800 text-xs px-2 py-1 rounded text-zinc-300">{p.subCategory}</span>
                        </td>
                        <td className="p-4 text-cyan-400 font-bold">€{p.retailPrice?.toFixed(2)}</td>
                        <td className="p-4 flex justify-end gap-2">
                          <button onClick={() => handleEdit(p)} className="p-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"><Edit2 size={16} /></button>
                          <button onClick={() => handleDelete(p.instoreCode)} className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"><Trash2 size={16} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default AdminDashboard;
