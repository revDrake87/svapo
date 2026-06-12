import { useState, useEffect } from 'react';
import './index.css';

function App() {
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
    <div className="min-h-screen bg-gray-100 font-sans">
      <header className="bg-blue-600 text-white p-4 shadow-md sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">VapeStore Vetrina</h1>
          <div className="flex items-center space-x-2">
            <span className="bg-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
              Carrello: {cart.length} {cart.length === 1 ? 'articolo' : 'articoli'}
            </span>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 flex flex-col md:flex-row gap-6 mt-4">
        {/* Catalog Section */}
        <div className="md:w-2/3">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Catalogo Prodotti</h2>
          
          {loading && <p className="text-gray-600">Caricamento prodotti...</p>}
          
          {error && (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert">
              <p className="font-bold">Nota:</p>
              <p>Il backend potrebbe non essere connesso ({error}). Ecco alcuni prodotti di esempio per visualizzare l'interfaccia.</p>
            </div>
          )}

          {/* Placeholder for products if backend is down, just for demonstration */}
          {products.length === 0 && !loading && (
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               {[
                 { instoreCode: 1, barcode: "805123", name: "Menta Glaciale 10ml", description: "Liquido pronto all'uso", retailPrice: 5.90, category: "LIQUIDO", subCategory: "TPD", flavor: "Menta", nicotineStrength: "4mg/ml", milliliters: 10 },
                 { instoreCode: 2, barcode: "805124", name: "Tabacco Secco Mini", description: "Aroma concentrato scomposto", retailPrice: 12.90, category: "LIQUIDO", subCategory: "MINI_SHOT_10_10", flavor: "Tabacco", nicotineStrength: null, milliliters: 10 },
                 { instoreCode: 3, barcode: "805125", name: "Aroma Fragola 10ml", description: "Aroma puro da diluire", retailPrice: 6.00, category: "LIQUIDO", subCategory: "AROMA", flavor: "Fragola", nicotineStrength: null, milliliters: 10 },
                 { instoreCode: 4, barcode: "805126", name: "Nicotina Base 10ml", description: "Shot di nicotina neutra", retailPrice: 2.50, category: "LIQUIDO", subCategory: "NICOTINE_SHOT", flavor: null, nicotineStrength: "18mg/ml", milliliters: 10 }
               ].map(product => (
                 <div key={product.instoreCode} className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow flex flex-col relative">
                    <div className="absolute top-2 right-2 bg-gray-800 text-white text-xs px-2 py-1 rounded">
                      {product.subCategory?.replace(/_/g, ' ')}
                    </div>
                    <div className="h-40 bg-gray-200 rounded-md mb-4 flex items-center justify-center text-gray-400 mt-2">
                      [Immagine]
                    </div>
                    <h3 className="text-lg font-bold text-gray-800">{product.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                    
                    <div className="bg-blue-50 rounded p-2 mb-4 flex-grow text-sm">
                      <div className="text-gray-700"><strong>Codice:</strong> {product.barcode || product.instoreCode}</div>
                      {product.milliliters && <div className="text-gray-700"><strong>Quantità:</strong> {product.milliliters}ml</div>}
                      {product.flavor && <div className="text-gray-700"><strong>Gusto:</strong> {product.flavor}</div>}
                      {product.nicotineStrength && <div className="text-gray-700"><strong>Nicotina:</strong> {product.nicotineStrength}</div>}
                    </div>

                    <div className="flex justify-between items-center mt-auto">
                      <span className="font-bold text-blue-600">€{product.retailPrice?.toFixed(2)}</span>
                      <button 
                        onClick={() => addToCart(product)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors text-sm"
                      >
                        Aggiungi
                      </button>
                    </div>
                 </div>
               ))}
             </div>
          )}

          {products.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map(product => (
                <div key={product.instoreCode} className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow flex flex-col relative">
                  <div className="absolute top-2 right-2 bg-gray-800 text-white text-xs px-2 py-1 rounded">
                    {product.subCategory?.replace(/_/g, ' ')}
                  </div>
                  <div className="h-40 bg-gray-200 rounded-md mb-4 flex items-center justify-center text-gray-400 overflow-hidden mt-2">
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.name} className="object-cover h-full w-full" />
                    ) : (
                      <span>[Immagine]</span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                  
                  <div className="bg-blue-50 rounded p-2 mb-4 flex-grow text-sm">
                    <div className="text-gray-700"><strong>Codice:</strong> {product.barcode || product.instoreCode}</div>
                    {product.milliliters && <div className="text-gray-700"><strong>Quantità:</strong> {product.milliliters}ml</div>}
                    {product.flavor && <div className="text-gray-700"><strong>Gusto:</strong> {product.flavor}</div>}
                    {product.nicotineStrength && <div className="text-gray-700"><strong>Nicotina:</strong> {product.nicotineStrength}</div>}
                  </div>

                  <div className="flex justify-between items-center mt-auto">
                    <span className="font-bold text-blue-600">€{product.retailPrice?.toFixed(2)}</span>
                    <button 
                      onClick={() => addToCart(product)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors text-sm"
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
          <div className="bg-white p-6 rounded-lg shadow-md sticky top-24">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Il Tuo Carrello Locale</h2>
            <p className="text-xs text-gray-500 mb-4">
              Prepara qui la tua lista. Mostra questa schermata in negozio per completare l'acquisto!
            </p>

            {cart.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Il carrello è vuoto. Aggiungi dei prodotti dal catalogo.</p>
            ) : (
              <div className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto pr-2">
                {cart.map(item => (
                  <div key={item.instoreCode} className="flex justify-between items-center border-b pb-2">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800 text-sm">{item.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-600">€{item.retailPrice?.toFixed(2)} cad.</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center border rounded">
                        <button 
                          onClick={() => updateQuantity(item.instoreCode, item.quantity - 1)}
                          className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-l"
                        >
                          -
                        </button>
                        <span className="px-2 py-1 text-sm">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.instoreCode, item.quantity + 1)}
                          className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-r"
                        >
                          +
                        </button>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.instoreCode)}
                        className="text-xs text-red-500 hover:text-red-700"
                      >
                        Rimuovi
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {cart.length > 0 && (
              <div className="mt-6 pt-4 border-t">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-semibold text-gray-700">Totale stimato:</span>
                  <span className="text-xl font-bold text-blue-600">€{cartTotal.toFixed(2)}</span>
                </div>
                <button className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded transition-colors">
                  Mostra alla Cassa
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
