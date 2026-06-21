# Svapo Store Digital Catalog - Documentazione Tecnica

Questa documentazione illustra l'architettura, le tecnologie scelte, la struttura del software e le funzionalità implementate nello **Svapo Store Digital Catalog**, un'applicazione web moderna ideata per un negozio fisico di sigarette elettroniche.

---

## 1. Architettura Generale e Stack Tecnologico

Il progetto segue un'architettura **Client-Server** classica, separando nettamente l'interfaccia utente (Frontend) dalla logica di business e gestione dati (Backend).

### 1.1 Frontend (Client)
Il frontend è progettato per essere veloce, reattivo ed esteticamente in stile Vercel (minimalista, alto contrasto, font Inter).
*   **Libreria Principale:** React 19.
*   **Build Tool:** Vite (per un avvio rapido dell'ambiente di sviluppo e build ottimizzate).
*   **Styling:** Tailwind CSS (permette una rapida prototipazione stilistica tramite utility-classes).
*   **Routing:** React Router DOM (gestione della navigazione "Single Page Application" tra vetrina, prodotto e admin).
*   **Animazioni:** GSAP (GreenSock Animation Platform) per transizioni fluide e professionali all'ingresso dei prodotti.
*   **Icone:** Lucide React.

### 1.2 Backend (Server)
Il backend funge da API RESTful che comunica in formato JSON con il frontend.
*   **Framework Principale:** Java 21 con Spring Boot 3.2.x.
*   **Data Access:** Spring Data JPA (Hibernate) per mappare gli oggetti Java (Entities) sulle tabelle del database.
*   **Sicurezza:** Spring Security abbinato a JWT (JSON Web Tokens) per proteggere le rotte sensibili (Dashboard Admin).
*   **Database:** H2 Database (in-memory, utilizzato per test e sviluppo veloce tramite il file `data.sql`), con predisposizione immediata per MySQL in produzione.

---

## 2. Struttura del Software e Funzionalità

### 2.1 Backend: Modelli e Logica (Domain Layer)

Nel backend, il dominio applicativo è suddiviso in entità chiare:
*   `Product`: Modello ibrido. Visto che il negozio vende sia Liquidi che Hardware, l'entità è dotata di campi specifici (es. `flavor`, `milliliters` per i liquidi e `batteryType`, `wattage` per l'hardware). Il database usa una tabella unica per massimizzare le performance di lettura, filtrando poi tramite logica o query in base alla categoria.
*   `User`: Gestisce l'accesso alla dashboard. Cripta le password in bcrypt.
*   `StoreSettings`: Un'entità "Singleton" (avente un solo record con ID = 1) che memorizza le impostazioni globali del negozio configurabili dall'admin: Nome negozio, Logo (URL), Indirizzo, e i link ai vari canali Social/WhatsApp.

**Controller (Rotta API):**
*   `ProductController` (`/api/products`): Gestisce il CRUD (Create, Read, Update, Delete) dei prodotti. Gestisce inoltre l'upload delle immagini (salvataggio locale o storage) ritornando il relativo URL al frontend.
*   `AuthController` (`/api/auth/login`): Verifica le credenziali utente e rilascia un Token JWT valido.
*   `SettingsController` (`/api/settings`): Esponi e aggiorna le informazioni globali del brand.

### 2.2 Frontend: Componenti e Flusso Utente

L'App React è divisa in tre sezioni principali:

*   **CustomerView (Vetrina Pubblica):** 
    *   Mostra la lista dei prodotti recuperata in fase di "Mount" (tramite l'hook `useEffect`), dotata di Intersection Observer per lo scorrimento infinito.
    *   Offre funzionalità di ricerca (Testuale) e filtraggio avanzato (Categoria, Sotto-categoria, Gusto).
    *   Include la "Lista Acquisto" (Cart): uno stato React che aggiunge e somma i prodotti scelti dall'utente, utile da mostrare fisicamente in cassa.
    *   *Scelta implementativa: Il footer è stato reso dinamico per mostrare i link ai social, all'indirizzo fisico e un pulsante WhatsApp (costruito estrapolando solo i numeri dalla stringa impostata).*

*   **ProductDetail (Dettaglio Prodotto):** 
    *   Mostra in profondità tutte le specifiche di una singola referenza in base al suo `instoreCode`.

*   **AdminDashboard (Pannello di Amministrazione):** 
    *   **Sicurezza Frontend:** Accessibile solo dopo aver superato un form di login. Il token JWT ricevuto dal server viene salvato nel `localStorage` del browser e inviato negli header (`Authorization: Bearer <token>`) di ogni successiva richiesta "protetta" (POST/PUT/DELETE) per gestire prodotti e configurazioni.
    *   Permette la gestione dinamica dei prodotti e l'upload di foto.
    *   Offre un pannello dedicato alla modifica di `StoreSettings` (Nome, Logo, Indirizzo e Social).

---

## 3. Scelte Architetturali Ricorrenti e Sicurezza

*   **Accessibilità in Rete Locale (Mobile Testing):** Per permettere il collaudo dell'applicazione da smartphone tramite rete Wi-Fi (fondamentale per validare l'esperienza UI Mobile-First), Vite è stato istruito (via `vite.config.js` -> `server: { host: '0.0.0.0' }`) ad esporre l'host su tutta la LAN. 
*   **Gestione Dinamica Endpoint API (`apiConfig.js`):** Piuttosto che forzare il frontend a richiedere dati sempre a `localhost:8080` (il che non funzionerebbe se testato dallo smartphone), è stata creata la funzione `getApiUrl()`. Questa deduce automaticamente l'indirizzo del backend basandosi su `window.location.hostname`, garantendo che l'app reagisca in modo "smart" ovunque sia ospitata.
*   **Gestione Immagini:** Il backend implementa un meccanismo di Multipart File Upload per permettere agli amministratori di caricare fisicamente sul server immagini per i prodotti e per il Logo del negozio.
*   **Dati di Sviluppo (`data.sql`):** Al boot, Spring Boot legge il file `data.sql` ed inietta centinaia di prodotti reali presi dal mercato italiano dello svapo (grazie ad uno scraping ad-hoc) con tanto di immagini collegate a un placeholder grafico (500x500px). Ciò riduce i tempi morti dello sviluppatore.

---

## 4. Evoluzioni e Modifiche Recenti
In risposta alle più recenti richieste di estensione dell'applicazione:
1.  Il database è stato esteso introducendo il tracciamento dei Social e del Logo. 
2.  L'UI è stata adattata per iniettare l'header personalizzato e generare dinamicamente il Footer di ogni pagina con tali informazioni.
3.  L'uso di una combinazione Regex in JavaScript (`replace(/[^0-9]/g, '')`) permette all'amministratore di incollare i numeri di telefono con spazi e prefissi, e al software di creare un link WhatsApp API sempre perfettamente valido.
4.  Supporto Multi-store: isolamento dei dati per negozi multipli (Professional Vape, Puff Store) tramite chiavi `storeId` ed environment variables nel frontend (`VITE_STORE_CODE`).
5.  Introduzione dello scorrimento infinito (infinite scroll) basato su IntersectionObserver nel catalogo prodotti, in sostituzione della paginazione classica.
