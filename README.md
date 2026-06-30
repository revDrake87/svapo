# Svapo Store Digital Catalog

Un catalogo digitale moderno e responsivo progettato per un negozio fisico di sigarette elettroniche (svapo). L'applicazione permette ai clienti di sfogliare i prodotti (liquidi, hardware, accessori), filtrare per categoria, e creare una "Lista Acquisti" da mostrare in cassa. Include anche un pannello di amministrazione protetto per la gestione completa dell'inventario.

L'interfaccia utente è stata recentemente aggiornata per seguire il pattern grafico minimalista ed elegante di Next.js / Vercel (font Inter, alto contrasto, design pulito).

## 🌟 Funzionalità Principali

*   **Catalogo Clienti:** Visualizzazione a griglia con filtri avanzati per categorie (Liquidi, Hardware, ecc.), ricerca testuale e impaginazione.
*   **Lista Acquisti:** Un carrello virtuale pensato per l'esperienza in negozio (mostra al cassiere cosa vuoi acquistare).
*   **Design Vercel-like:** UI moderna, transizioni fluide, font Inter, e supporto completo per Light/Dark Mode.
*   **Pannello Admin Protetto:** Area riservata accessibile tramite autenticazione sicura JWT.
*   **Gestione Prodotti (CRUD):** Aggiunta, modifica, eliminazione e caricamento immagini dei prodotti. Gestione di attributi ibridi (es. wattaggio e batteria per l'hardware, nicotina e aroma per i liquidi).
*   **Impostazioni Dinamiche:** Modifica del nome del negozio globalmente, direttamente dal pannello admin.

## 🛠️ Stack Tecnologico

**Frontend:**
*   React 19 + Vite
*   Tailwind CSS (Styling custom in stile Vercel)
*   React Router (Navigazione)
*   Lucide React (Icone)
*   GSAP (Animazioni)

**Backend:**
*   Java 21 + Spring Boot
*   Spring Security + JWT (Autenticazione e Sicurezza)
*   Spring Data JPA (Hibernate)
*   Database H2 (In-memory per sviluppo rapido) / MySQL (Per la produzione)

## 🚀 Come avviare il progetto localmente

### Prerequisiti
*   Node.js (v18+) e npm
*   Java Development Kit (JDK) 17 o superiore
*   Maven

### 1. Avvio del Backend
Il backend utilizza di default un database in memoria (H2) che si resetta ad ogni avvio. I dati e i prodotti iniziali vengono popolati automaticamente dal file `data.sql`.
```bash
cd backend
mvn spring-boot:run
```
*Il server backend sarà in ascolto su `http://localhost:8080`.*

### 2. Avvio del Frontend
In una nuova finestra del terminale:
```bash
cd frontend
npm install
npm run dev
```
*Il frontend sarà accessibile all'indirizzo `http://localhost:5173`.*

## 🔐 Accesso Admin
Per accedere alla dashboard di amministrazione, naviga su `http://localhost:5173/admin` ed usa le seguenti credenziali predefinite:
*   **Username:** `admin`
*   **Password:** `admin123`

*(Nota: La password è salvata nel database criptata in formato BCrypt. È possibile modificarla aggiornando l'hash direttamente nel file `backend/src/main/resources/data.sql`).*

## 🗄️ Passaggio a MySQL (Produzione)
Il progetto è già predisposto per l'uso di un vero database MySQL. Consulta il file `mysql_setup_guide.md` presente nella root di questa repository per le istruzioni dettagliate su come configurare la connessione al tuo database server su Fedora.

## 🌐 Deploy in Produzione

Per portare l'applicazione live su internet, si consiglia la seguente architettura Cloud-Native:

1.  **Frontend su Firebase Hosting:**
    - Compila l'app con `npm run build`.
    - Inizializza il progetto con `firebase init hosting` e fai deploy della cartella `dist` con `firebase deploy`.
2.  **Backend su Railway:**
    - Collega il repository GitHub a [Railway.app](https://railway.app/).
    - Railway rileverà automaticamente l'applicazione Java/Maven (o utilizzerà il `Dockerfile`) ed avvierà l'API esponendola pubblicamente su HTTPS.
3.  **Database MySQL su Aiven:**
    - Crea un servizio MySQL gestito su [Aiven.io](https://aiven.io/).
    - Copia i parametri di connessione e inseriscili come variabili d'ambiente (Environment Variables) sul pannello di controllo di Railway (`DB_HOST`, `DB_PORT`, ecc.).

*(Assicurati di aggiornare `apiConfig.js` sul frontend affinché punti al dominio di Railway prima di effettuare la build per Firebase).*