import { getApiUrl } from "./apiConfig";
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, Image as ImageIcon, Save, X, LogOut, Sun, Moon } from 'lucide-react';

function AdminDashboard({ isDarkMode, toggleTheme, storeName, setStoreName, settings, setSettings }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editableSettings, setEditableSettings] = useState(settings);

  useEffect(() => {
    setEditableSettings(settings);
  }, [settings]);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsAuthenticated(true);
    }
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    fetch(`${getApiUrl()}/products`)
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

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${getApiUrl()}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'admin', password: password })
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('adminToken', data.token);
        setIsAuthenticated(true);
      } else {
        alert('Password errata!');
      }
    } catch (err) {
      alert('Errore di connessione al server.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
    localStorage.removeItem('adminToken');
  };

  const handleDelete = (id) => {
    if (window.confirm('Sei sicuro di voler eliminare questo prodotto?')) {
      const token = localStorage.getItem('adminToken');
      fetch(`${getApiUrl()}/products/${id}`, { 
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
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
      tankCapacity: '',
      isAvailable: true
    });
    setIsEditing(true);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('adminToken');
    fetch(`${getApiUrl()}/products/upload`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
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

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingLogo(true);
    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('adminToken');
    fetch(`${getApiUrl()}/products/upload`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData,
    })
      .then(res => res.text())
      .then(url => {
        setEditableSettings({ ...editableSettings, logoUrl: url });
        setUploadingLogo(false);
      })
      .catch(err => {
        console.error("Upload failed", err);
        setUploadingLogo(false);
        alert('Upload logo fallito');
      });
  };

  const handleSettingsSave = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    fetch(`${getApiUrl()}/settings`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ id: 1, ...editableSettings })
    })
      .then(res => res.json())
      .then(data => {
        setStoreName(data.storeName);
        setSettings(data);
        setIsSettingsOpen(false);
      })
      .catch(err => console.error("Failed to save settings", err));
  };

  const handleSave = (e) => {
    e.preventDefault();
    const method = currentProduct.instoreCode ? 'PUT' : 'POST';
    const url = currentProduct.instoreCode 
      ? `${getApiUrl()}/products/${currentProduct.instoreCode}`
      : `${getApiUrl()}/products`;

    const token = localStorage.getItem('adminToken');
    fetch(url, {
      method: method,
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
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
      <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center font-sans text-gray-900 dark:text-gray-200 transition-colors duration-300">
        <form onSubmit={handleLogin} className="bg-white dark:bg-[#0A0A0A] p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-white/10 w-96 transition-colors">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">Area Riservata Admin</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-zinc-400 mb-2">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-50 dark:bg-black border border-gray-300 dark:border-white/20 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-cyan-500 transition-colors"
              required
            />
          </div>
          <button type="submit" className="w-full bg-black dark:bg-white hover:bg-blue-700 dark:hover:bg-cyan-400 text-white dark:text-black font-bold py-2 rounded-lg transition-colors">
            Accedi
          </button>
          <div className="mt-4 text-center">
            <Link to="/" className="text-gray-500 dark:text-zinc-500 text-sm hover:text-gray-900 dark:hover:text-white transition-colors">Torna al catalogo</Link>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-200 font-sans transition-colors duration-300">
      <header className="bg-white dark:bg-zinc-950 border-b border-gray-200 dark:border-white/10 text-gray-900 dark:text-white p-4 sticky top-0 z-20 transition-colors">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">{storeName} - Admin</h1>
          <div className="flex gap-4 items-center">
            <button onClick={() => setIsSettingsOpen(true)} className="text-sm font-medium text-black dark:text-cyan-400 hover:text-blue-800 dark:hover:text-cyan-300 transition-colors">
              Impostazioni
            </button>
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-zinc-800 transition-colors">
              {isDarkMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-black" />}
            </button>
            <Link to="/" className="text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white text-sm transition-colors">Vetrina Pubblica</Link>
            <button onClick={handleLogout} className="flex items-center gap-2 text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-sm transition-colors">
              <LogOut size={16} /> Esci
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 mt-6">
        {isSettingsOpen ? (
          <div className="bg-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-xl max-w-2xl mx-auto transition-colors">
            <div className="flex justify-between items-center mb-6 border-b border-gray-200 dark:border-white/10 pb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Impostazioni Negozio
              </h2>
              <button onClick={() => setIsSettingsOpen(false)} className="text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white transition-colors"><X size={24} /></button>
            </div>
            <form onSubmit={handleSettingsSave} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-600 dark:text-zinc-400 mb-1">Nome del Negozio</label>
                    <input 
                      type="text" 
                      required 
                      value={editableSettings.storeName} 
                      onChange={e => setEditableSettings({...editableSettings, storeName: e.target.value})} 
                      className="w-full bg-gray-50 dark:bg-black border border-gray-300 dark:border-white/20 rounded px-3 py-2 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-cyan-500 outline-none transition-colors" 
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 dark:text-zinc-400 mb-1">Indirizzo</label>
                    <input 
                      type="text" 
                      value={editableSettings.address} 
                      onChange={e => setEditableSettings({...editableSettings, address: e.target.value})} 
                      placeholder="es. Via Roma 1, Milano"
                      className="w-full bg-gray-50 dark:bg-black border border-gray-300 dark:border-white/20 rounded px-3 py-2 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-cyan-500 outline-none transition-colors" 
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 dark:text-zinc-400 mb-1">Logo</label>
                    <div className="flex gap-4 items-center">
                      <div className="w-16 h-16 bg-gray-100 dark:bg-black border border-gray-300 dark:border-white/20 rounded overflow-hidden flex items-center justify-center shrink-0">
                        {editableSettings.logoUrl ? (
                          <img src={editableSettings.logoUrl} alt="Logo" className="w-full h-full object-contain" />
                        ) : (
                          <ImageIcon className="text-gray-400 dark:text-zinc-600" size={24} />
                        )}
                      </div>
                      <div className="flex-1">
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={handleLogoUpload}
                          disabled={uploadingLogo}
                          className="w-full text-xs text-gray-900 dark:text-white file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 dark:file:bg-blue-900/20 file:text-blue-700 dark:file:text-blue-400 hover:file:bg-blue-100 dark:hover:file:bg-blue-900/30"
                        />
                        {uploadingLogo && <span className="text-xs text-blue-500 mt-1 block">Caricamento in corso...</span>}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-white/10 pb-1">Social & Contatti</h3>
                  
                  <div>
                    <label className="block text-sm text-gray-600 dark:text-zinc-400 mb-1">Instagram URL</label>
                    <input 
                      type="text" 
                      value={editableSettings.instagram} 
                      onChange={e => setEditableSettings({...editableSettings, instagram: e.target.value})} 
                      placeholder="https://instagram.com/tuoprofilo"
                      className="w-full bg-gray-50 dark:bg-black border border-gray-300 dark:border-white/20 rounded px-3 py-2 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-cyan-500 outline-none transition-colors" 
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 dark:text-zinc-400 mb-1">Facebook URL</label>
                    <input 
                      type="text" 
                      value={editableSettings.facebook} 
                      onChange={e => setEditableSettings({...editableSettings, facebook: e.target.value})} 
                      placeholder="https://facebook.com/tuapagina"
                      className="w-full bg-gray-50 dark:bg-black border border-gray-300 dark:border-white/20 rounded px-3 py-2 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-cyan-500 outline-none transition-colors" 
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 dark:text-zinc-400 mb-1">TikTok URL</label>
                    <input 
                      type="text" 
                      value={editableSettings.tiktok} 
                      onChange={e => setEditableSettings({...editableSettings, tiktok: e.target.value})} 
                      placeholder="https://tiktok.com/@tuoprofilo"
                      className="w-full bg-gray-50 dark:bg-black border border-gray-300 dark:border-white/20 rounded px-3 py-2 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-cyan-500 outline-none transition-colors" 
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 dark:text-zinc-400 mb-1">WhatsApp (Numero)</label>
                    <input 
                      type="text" 
                      value={editableSettings.whatsapp} 
                      onChange={e => setEditableSettings({...editableSettings, whatsapp: e.target.value})} 
                      placeholder="+39 333 1234567"
                      className="w-full bg-gray-50 dark:bg-black border border-gray-300 dark:border-white/20 rounded px-3 py-2 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-cyan-500 outline-none transition-colors" 
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 dark:border-white/10">
                <button type="button" onClick={() => setIsSettingsOpen(false)} className="px-6 py-2 rounded-lg bg-gray-200 dark:bg-zinc-800 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-zinc-700 transition-colors">Annulla</button>
                <button type="submit" className="px-6 py-2 rounded-lg bg-black dark:bg-white text-white dark:text-black font-bold hover:bg-blue-700 dark:hover:bg-cyan-400 transition-colors flex items-center gap-2">
                  <Save size={18} /> Salva Impostazioni
                </button>
              </div>
            </form>
          </div>
        ) : isEditing ? (
          <div className="bg-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-xl max-w-4xl mx-auto transition-colors">
            <div className="flex justify-between items-center mb-6 border-b border-gray-200 dark:border-white/10 pb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {currentProduct.instoreCode ? 'Modifica Prodotto' : 'Nuovo Prodotto'}
              </h2>
              <button onClick={() => setIsEditing(false)} className="text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white transition-colors"><X size={24} /></button>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Dati Base */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-black dark:text-cyan-400 border-b border-gray-200 dark:border-white/5 pb-2">Informazioni Base</h3>
                  
                  <div className="flex justify-between items-center bg-gray-50 dark:bg-zinc-800/50 p-3 rounded border border-gray-200 dark:border-white/10">
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white">Prodotto Disponibile</h4>
                      <p className="text-xs text-gray-500 dark:text-zinc-400">Rendi visibile questo prodotto nel catalogo pubblico</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={currentProduct.isAvailable !== false} onChange={e => setCurrentProduct({...currentProduct, isAvailable: e.target.checked})} />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-black dark:peer-checked:bg-cyan-500"></div>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 dark:text-zinc-400 mb-1">Categoria</label>
                    <select 
                      value={currentProduct.category} 
                      onChange={e => setCurrentProduct({...currentProduct, category: e.target.value, subCategory: e.target.value === 'LIQUIDO' ? 'TPD' : 'BATTERY_BOX'})}
                      className="w-full bg-gray-50 dark:bg-black border border-gray-300 dark:border-white/20 rounded px-3 py-2 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-cyan-500 outline-none transition-colors"
                    >
                      <option value="LIQUIDO">Liquido</option>
                      <option value="HARDWARE">Hardware</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 dark:text-zinc-400 mb-1">Sotto-Categoria</label>
                    {currentProduct.category === 'LIQUIDO' ? (
                      <select 
                        value={currentProduct.subCategory || 'TPD'} 
                        onChange={e => setCurrentProduct({...currentProduct, subCategory: e.target.value})}
                        className="w-full bg-gray-50 dark:bg-black border border-gray-300 dark:border-white/20 rounded px-3 py-2 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-cyan-500 outline-none transition-colors"
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
                        className="w-full bg-gray-50 dark:bg-black border border-gray-300 dark:border-white/20 rounded px-3 py-2 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-cyan-500 outline-none transition-colors"
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
                    <label className="block text-sm text-gray-600 dark:text-zinc-400 mb-1">Nome Prodotto</label>
                    <input type="text" required value={currentProduct.name} onChange={e => setCurrentProduct({...currentProduct, name: e.target.value})} className="w-full bg-gray-50 dark:bg-black border border-gray-300 dark:border-white/20 rounded px-3 py-2 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-cyan-500 outline-none transition-colors" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 dark:text-zinc-400 mb-1">Barcode</label>
                      <input type="text" value={currentProduct.barcode || ''} onChange={e => setCurrentProduct({...currentProduct, barcode: e.target.value})} className="w-full bg-gray-50 dark:bg-black border border-gray-300 dark:border-white/20 rounded px-3 py-2 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-cyan-500 outline-none transition-colors" />
                    </div>
                    {currentProduct.category === 'LIQUIDO' && (
                      <div>
                        <label className="block text-sm text-gray-600 dark:text-zinc-400 mb-1">Millilitri (ml)</label>
                        <input type="number" value={currentProduct.milliliters || ''} onChange={e => setCurrentProduct({...currentProduct, milliliters: e.target.value})} className="w-full bg-gray-50 dark:bg-black border border-gray-300 dark:border-white/20 rounded px-3 py-2 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-cyan-500 outline-none transition-colors" />
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 dark:text-zinc-400 mb-1">Prezzo Acquisto (€)</label>
                      <input type="number" step="0.01" value={currentProduct.purchasePrice || 0} onChange={e => setCurrentProduct({...currentProduct, purchasePrice: parseFloat(e.target.value)})} className="w-full bg-gray-50 dark:bg-black border border-gray-300 dark:border-white/20 rounded px-3 py-2 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-cyan-500 outline-none transition-colors" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 dark:text-zinc-400 mb-1">Prezzo Pubblico (€)</label>
                      <input type="number" step="0.01" required value={currentProduct.retailPrice || 0} onChange={e => setCurrentProduct({...currentProduct, retailPrice: parseFloat(e.target.value)})} className="w-full bg-gray-50 dark:bg-black border border-gray-300 dark:border-white/20 rounded px-3 py-2 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-cyan-500 outline-none transition-colors" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-600 dark:text-zinc-400 mb-1">Descrizione</label>
                    <textarea rows="3" value={currentProduct.description || ''} onChange={e => setCurrentProduct({...currentProduct, description: e.target.value})} className="w-full bg-gray-50 dark:bg-black border border-gray-300 dark:border-white/20 rounded px-3 py-2 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-cyan-500 outline-none transition-colors" />
                  </div>
                </div>

                {/* Specifiche Dinamiche & Immagine */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-white/5 pb-2">
                    {currentProduct.category === 'LIQUIDO' ? 'Specifiche Liquido' : 'Specifiche Hardware'}
                  </h3>

                  {currentProduct.category === 'LIQUIDO' ? (
                    <>
                      <div>
                        <label className="block text-sm text-gray-600 dark:text-zinc-400 mb-1">Gusto Principale</label>
                        <input type="text" placeholder="es. Menta, Tabacco" value={currentProduct.flavor || ''} onChange={e => setCurrentProduct({...currentProduct, flavor: e.target.value})} className="w-full bg-gray-50 dark:bg-black border border-gray-300 dark:border-white/20 rounded px-3 py-2 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-cyan-500 outline-none transition-colors" />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 dark:text-zinc-400 mb-1">Ingredienti (separati da virgola)</label>
                        <input type="text" placeholder="es. Menta, Ghiaccio, Limone" value={currentProduct.ingredients || ''} onChange={e => setCurrentProduct({...currentProduct, ingredients: e.target.value})} className="w-full bg-gray-50 dark:bg-black border border-gray-300 dark:border-white/20 rounded px-3 py-2 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-cyan-500 outline-none transition-colors" />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 dark:text-zinc-400 mb-1">Gradazione Nicotina</label>
                        <input type="text" placeholder="es. 4mg/ml, Zero" value={currentProduct.nicotineStrength || ''} onChange={e => setCurrentProduct({...currentProduct, nicotineStrength: e.target.value})} className="w-full bg-gray-50 dark:bg-black border border-gray-300 dark:border-white/20 rounded px-3 py-2 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-cyan-500 outline-none transition-colors" />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-gray-600 dark:text-zinc-400 mb-1">Colore</label>
                          <input type="text" value={currentProduct.color || ''} onChange={e => setCurrentProduct({...currentProduct, color: e.target.value})} className="w-full bg-gray-50 dark:bg-black border border-gray-300 dark:border-white/20 rounded px-3 py-2 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-cyan-500 outline-none transition-colors" />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 dark:text-zinc-400 mb-1">Wattaggio Max (W)</label>
                          <input type="number" value={currentProduct.wattage || ''} onChange={e => setCurrentProduct({...currentProduct, wattage: parseInt(e.target.value)})} className="w-full bg-gray-50 dark:bg-black border border-gray-300 dark:border-white/20 rounded px-3 py-2 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-cyan-500 outline-none transition-colors" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 dark:text-zinc-400 mb-1">Tipo Batteria</label>
                        <input type="text" placeholder="es. Integrata 1000mAh, 18650" value={currentProduct.batteryType || ''} onChange={e => setCurrentProduct({...currentProduct, batteryType: e.target.value})} className="w-full bg-gray-50 dark:bg-black border border-gray-300 dark:border-white/20 rounded px-3 py-2 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-cyan-500 outline-none transition-colors" />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 dark:text-zinc-400 mb-1">Capacità Tank (ml)</label>
                        <input type="number" step="0.1" value={currentProduct.tankCapacity || ''} onChange={e => setCurrentProduct({...currentProduct, tankCapacity: parseFloat(e.target.value)})} className="w-full bg-gray-50 dark:bg-black border border-gray-300 dark:border-white/20 rounded px-3 py-2 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-cyan-500 outline-none transition-colors" />
                      </div>
                    </>
                  )}

                  <h3 className="text-lg font-semibold text-emerald-600 dark:text-emerald-400 border-b border-gray-200 dark:border-white/5 pb-2 mt-6">Immagine</h3>
                  
                  <div className="flex gap-4 items-start">
                    <div className="w-32 h-32 bg-gray-100 dark:bg-black border border-gray-300 dark:border-white/20 rounded-xl overflow-hidden flex items-center justify-center shrink-0 transition-colors">
                      {currentProduct.imageUrl ? (
                        <img src={currentProduct.imageUrl} alt="preview" className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="text-gray-400 dark:text-zinc-600" size={32} />
                      )}
                    </div>
                    <div className="flex-1 space-y-2">
                      <label className="block text-sm text-gray-600 dark:text-zinc-400 mb-1">Carica nuova immagine</label>
                      <input 
                        type="file" 
                        accept="image/jpeg, image/png, image/webp"
                        onChange={handleImageUpload}
                        disabled={uploadingImage}
                        className="w-full text-sm text-gray-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-100 dark:file:bg-emerald-500/10 file:text-emerald-700 dark:file:text-emerald-400 hover:file:bg-emerald-200 dark:hover:file:bg-emerald-500/20 transition-colors"
                      />
                      <p className="text-xs text-gray-500 dark:text-zinc-500 mt-1">
                        Formati supportati: JPG, PNG, WEBP. Max: 5MB.<br/>
                        <em>Dimensioni consigliate: Quadrate (es. 500x500px).</em>
                      </p>
                      {uploadingImage && <p className="text-xs text-emerald-600 dark:text-emerald-400 animate-pulse mt-1">Caricamento in corso...</p>}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 dark:border-white/10">
                <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-2 rounded-lg bg-gray-200 dark:bg-zinc-800 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-zinc-700 transition-colors">Annulla</button>
                <button type="submit" className="px-6 py-2 rounded-lg bg-black dark:bg-white text-white dark:text-black font-bold hover:bg-blue-700 dark:hover:bg-cyan-400 transition-colors flex items-center gap-2">
                  <Save size={18} /> Salva Prodotto
                </button>
              </div>
            </form>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Prodotti a Catalogo</h2>
              <button onClick={handleAddNew} className="bg-black dark:bg-white text-white dark:text-black font-bold px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 dark:hover:bg-cyan-400 transition-colors">
                <Plus size={18} /> Aggiungi Nuovo
              </button>
            </div>

            {loading ? (
              <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                 <div className="w-5 h-5 border-2 border-blue-600 dark:border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                 <p>Caricamento...</p>
              </div>
            ) : (
              <div className="bg-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-lg dark:shadow-xl transition-colors">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-black/50 border-b border-gray-200 dark:border-white/10 transition-colors">
                        <th className="p-4 text-xs uppercase text-gray-500 dark:text-zinc-500 font-bold">Img</th>
                        <th className="p-4 text-xs uppercase text-gray-500 dark:text-zinc-500 font-bold">Codice</th>
                        <th className="p-4 text-xs uppercase text-gray-500 dark:text-zinc-500 font-bold">Nome</th>
                        <th className="p-4 text-xs uppercase text-gray-500 dark:text-zinc-500 font-bold">Categoria</th>
                        <th className="p-4 text-xs uppercase text-gray-500 dark:text-zinc-500 font-bold">Stato</th>
                        <th className="p-4 text-xs uppercase text-gray-500 dark:text-zinc-500 font-bold">Prezzo</th>
                        <th className="p-4 text-xs uppercase text-gray-500 dark:text-zinc-500 font-bold text-right">Azioni</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map(p => (
                        <tr key={p.instoreCode} className={`border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors ${p.isAvailable === false ? 'opacity-60' : ''}`}>
                          <td className="p-4">
                            <div className="w-10 h-10 bg-gray-100 dark:bg-black rounded-md flex items-center justify-center overflow-hidden border border-gray-200 dark:border-transparent">
                              {p.imageUrl ? <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" /> : <ImageIcon size={16} className="text-gray-400 dark:text-zinc-600" />}
                            </div>
                          </td>
                          <td className="p-4 text-sm font-mono text-gray-600 dark:text-zinc-400">{p.instoreCode}</td>
                          <td className="p-4 font-bold text-gray-900 dark:text-white">{p.name}</td>
                          <td className="p-4">
                            <span className="bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-transparent text-xs px-2 py-1 rounded text-gray-600 dark:text-zinc-300">{p.subCategory}</span>
                          </td>
                          <td className="p-4">
                            {p.isAvailable !== false ? (
                              <span className="bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 text-xs px-2 py-1 rounded">Disponibile</span>
                            ) : (
                              <span className="bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400 text-xs px-2 py-1 rounded">Nascosto</span>
                            )}
                          </td>
                          <td className="p-4 text-black dark:text-cyan-400 font-bold">€{p.retailPrice?.toFixed(2)}</td>
                          <td className="p-4 flex justify-end gap-2">
                            <button onClick={() => handleEdit(p)} className="p-2 bg-blue-100 dark:bg-blue-500/10 text-black dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-500/20 rounded-lg transition-colors"><Edit2 size={16} /></button>
                            <button onClick={() => handleDelete(p.instoreCode)} className="p-2 bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-500/20 rounded-lg transition-colors"><Trash2 size={16} /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default AdminDashboard;
