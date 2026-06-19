import { Link } from 'react-router-dom';
import { Sun, Moon } from "lucide-react";

function Header({ isDarkMode, toggleTheme, storeName, settings, cartItemCount, hideCartButton = false }) {
  return (
    <header className="bg-white/80 dark:bg-[#000000]/80 backdrop-blur-md border-b border-gray-200 dark:border-white/10 p-4 sticky top-0 z-20 transition-colors duration-300">
      <div className="container mx-auto flex flex-col gap-4">
        {/* Top Row: Logo, Name, Settings & Actions */}
        <div className="flex justify-between items-start md:items-center">
          <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6">
            <Link to="/" className="flex items-center gap-3 group">
              {settings?.logoUrl && (
                <img src={settings.logoUrl} alt="Store Logo" className="h-12 w-auto object-contain group-hover:scale-105 transition-transform" />
              )}
              <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white hidden sm:block">
                {storeName}
              </h1>
            </Link>
            
            {/* Store Details (Address & Socials) inline on larger screens */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs font-medium text-gray-500 dark:text-zinc-400">
              {settings?.address && (
                <div className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  {settings.address}
                </div>
              )}
              <div className="flex items-center gap-3">
                {settings?.instagram && (
                  <a href={settings.instagram} target="_blank" rel="noreferrer" className="hover:text-black dark:hover:text-white transition-colors">Instagram</a>
                )}
                {settings?.facebook && (
                  <a href={settings.facebook} target="_blank" rel="noreferrer" className="hover:text-black dark:hover:text-white transition-colors">Facebook</a>
                )}
                {settings?.tiktok && (
                  <a href={settings.tiktok} target="_blank" rel="noreferrer" className="hover:text-black dark:hover:text-white transition-colors">TikTok</a>
                )}
                {settings?.whatsapp && (
                  <a href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="hover:text-green-500 transition-colors">WhatsApp</a>
                )}
              </div>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-3 shrink-0">
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-zinc-800 transition-colors">
              {isDarkMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-black" />}
            </button>
            <Link to="/admin" className="text-sm font-medium text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white transition-colors hidden sm:block">Admin Area</Link>
            {!hideCartButton && (
              <Link to="/cart" className="flex items-center gap-2 bg-black dark:bg-white hover:bg-blue-700 dark:hover:bg-cyan-400 text-white dark:text-black px-4 py-2 rounded-full text-sm font-bold transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                Lista Acquisti <span className="bg-white/20 dark:bg-black/10 px-2 py-0.5 rounded-full text-xs">{cartItemCount}</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
