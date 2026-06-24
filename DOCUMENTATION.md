# Svapo Store Digital Catalog - Documentazione Tecnica

Questa documentazione illustra l'architettura, le tecnologie scelte, la struttura del software e le funzionalità implementate nello **Svapo Store Digital Catalog**, un'applicazione web moderna ideata per un negozio fisico di sigarette elettroniche.

---

## 1. Architettura Generale e Stack Tecnologico

Il progetto segue un'architettura **Client-Server** classica, separando nettamente l'interfaccia utente (Frontend) dalla logica di business e gestione dati (Backend).

### 1.1 Frontend (Client)
Il frontend è progettato per essere veloce, reattivo ed esteticamente in stile Vercel (minimalista, alto contrasto, font Inter).
*   **Libreria Principale:** React 19.
*   **Build Tool:** Vite (per un avvio rapido dell'ambiente di sviluppo e build ottimizzate).
*   **Styling:** Tailwind CSS (permette una rapida prototipazione stilistica tramite utility-classes e supporta variabili custom per temi specifici per negozio).
*   **Routing:** React Router DOM v6 (gestione della navigazione "Single Page Application" tra vetrina, prodotto e admin con percorsi dinamici `/:storeCode`).
*   **Animazioni:** GSAP (GreenSock Animation Platform) per transizioni fluide e professionali all'ingresso dei prodotti.
*   **Icone:** Lucide React.

### 1.2 Backend (Server)
Il backend funge da API RESTful che comunica in formato JSON con il frontend.
*   **Framework Principale:** Java 21 con Spring Boot 3.2.x.
*   **Data Access:** Spring Data JPA (Hibernate) per mappare gli oggetti Java (Entities) sulle tabelle del database.
*   **Sicurezza:** Spring Security abbinato a JWT (JSON Web Tokens) per proteggere le rotte sensibili (Dashboard Admin) permettendo al contempo l'accesso pubblico alla cartella degli upload (`/uploads/**`).
*   **Database:** H2 Database (in-memory, utilizzato per test e sviluppo veloce tramite il file `data.sql`), con predisposizione immediata per MySQL in produzione.

---

## 2. Struttura del Software e Funzionalità

### 2.1 Backend: Modelli e Logica (Domain Layer)

Nel backend, il dominio applicativo è suddiviso in entità chiare:
*   `Product`: Modello ibrido. Visto che il negozio vende sia Liquidi che Hardware, l'entità è dotata di campi specifici (es. `flavor`, `milliliters` per i liquidi e `batteryType`, `wattage` per l'hardware). Il database usa una tabella unica per massimizzare le performance di lettura, filtrando poi tramite logica o query in base alla categoria.
*   `User`: Gestisce l'accesso alla dashboard. Cripta le password in bcrypt.
*   `StoreSettings`: Memorizza le impostazioni globali di ogni negozio (isolate per `id` o `storeId`): Nome negozio, Logo (URL), Indirizzo, e i link ai vari canali Social/WhatsApp.

**Controller (Rotta API):**
*   `ProductController` (`/api/products`): Gestisce il CRUD dei prodotti. Implementa una logica di "Shadow Sync": creando un prodotto per un negozio, esso viene clonato (con visibilità a `false`) in tutti gli altri negozi. Include anche l'endpoint `/upload` per il caricamento delle immagini.
*   `AuthController` (`/api/auth/login`): Verifica le credenziali utente specifiche per negozio (`admin_prof`, `admin_puff`) e rilascia un Token JWT valido.
*   `SettingsController` (`/api/settings`): Esponi e aggiorna le informazioni globali del singolo brand.

### 2.2 Frontend: Componenti e Flusso Utente

L'App React è divisa in tre sezioni principali:

*   **CustomerView (Vetrina Pubblica):** 
    *   Mostra la lista dei prodotti dotata di **Intersection Observer** per lo scorrimento infinito (Infinite Scroll) rimpiazzando la vecchia paginazione.
    *   Offre funzionalità di ricerca (Testuale) e filtraggio avanzato (Categoria, Sotto-categoria, Gusto).
    *   Include la "Lista Acquisto" (Cart) isolata per store tramite local storage (`vapeCart_${storeCode}`).
    *   *Scelta implementativa: L'header è stato reso intelligente raggruppando indirizzo e social nel dropdown "Info & Social" (mobile-first) con supporto allo switch tra Light Mode e layout fissi (es. `PUFF_STORE`).*

*   **ProductDetail (Dettaglio Prodotto):** 
    *   Mostra in profondità tutte le specifiche di una singola referenza in base al suo `instoreCode`.

*   **AdminDashboard (Pannello di Amministrazione):** 
    *   Accessibile solo dopo aver superato un form di login. Il token JWT ricevuto dal server viene salvato nel `localStorage` del browser.
    *   Offre una barra di ricerca reattiva per cercare rapidamente i prodotti tramite nome o codice a barre.
    *   Supporta la creazione di sub-categorie personalizzate tramite interfaccia HTML5 `<datalist>`.
    *   Offre un pannello dedicato alla modifica di `StoreSettings` (Nome, Logo, Indirizzo e Social).

---

## 3. Scelte Architetturali Ricorrenti e Sicurezza

*   **Accessibilità in Rete Locale (Mobile Testing):** Per permettere il collaudo dell'applicazione da smartphone tramite rete Wi-Fi (fondamentale per validare l'esperienza UI Mobile-First), Vite è stato istruito (via `vite.config.js` -> `server: { host: '0.0.0.0' }`) ad esporre l'host su tutta la LAN. 
*   **Gestione Dinamica Endpoint API (`apiConfig.js`):** La funzione `getApiUrl()` deduce automaticamente l'indirizzo del backend basandosi su `window.location.hostname`, garantendo che l'app reagisca in modo "smart" ovunque sia ospitata.
*   **Gestione Immagini e Security:** Il backend salva i file (loghi, foto prodotto) localmente in `backend/uploads/`. Per permettere al frontend di visualizzarli senza token (es. vetrina pubblica), `WebSecurityConfig` permette esplicitamente i comandi GET verso la rotta `/uploads/**`.
*   **Dati di Sviluppo (`data.sql`):** Al boot, Spring Boot legge il file `data.sql` ed inietta centinaia di prodotti, gli store predefiniti e gli admin per favorire uno sviluppo rapido.
