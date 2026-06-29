# Svapo Store Digital Catalog - Documentazione Tecnica

Questa documentazione illustra l'architettura, le tecnologie scelte, la struttura del software e le funzionalità implementate nello **Svapo Store Digital Catalog**, un'applicazione web moderna ideata per un negozio fisico di sigarette elettroniche.

---

## 1. Architettura Generale e Stack Tecnologico

Il progetto segue un'architettura **Client-Server** classica, separando nettamente l'interfaccia utente (Frontend) dalla logica di business e gestione dati (Backend). I tre servizi — Frontend, Backend e Database — sono completamente dockerizzati e orchestrati tramite Docker Compose.

```
Browser
  │
  ▼
Frontend (Nginx :80)
  ├── /            → React SPA (file statici)
  ├── /api/        → proxy → Backend (:8080)
  └── /uploads/    → proxy → Backend (:8080)
         │
         ▼
     Backend (Spring Boot :8080)
         │
         ▼
     Database (MySQL :3306)
```

### 1.1 Frontend (Client)

- **Libreria Principale:** React 19
- **Build Tool:** Vite
- **Styling:** Tailwind CSS con CSS variables per il theming per negozio
- **Routing:** React Router DOM v6 (SPA con percorsi dinamici `/:storeCode`)
- **Animazioni:** GSAP per transizioni fluide all'ingresso dei prodotti
- **Icone:** Lucide React
- **Serving:** Nginx (in produzione/Docker) — serve i file statici e fa da reverse proxy verso il backend

### 1.2 Backend (Server)

- **Framework:** Java 21 con Spring Boot 3.2.x
- **Data Access:** Spring Data JPA (Hibernate) per il mapping ORM
- **Sicurezza:** Spring Security + JWT per proteggere le rotte admin
- **CORS:** Configurato tramite `CorsConfigurationSource` bean, con origini consentite iniettabili via variabile d'ambiente `ALLOWED_ORIGINS`
- **Database:** MySQL 8.0

### 1.3 Database

- **MySQL 8.0** — containerizzato con volume persistente `db_data`
- Lo schema viene gestito da Hibernate (`ddl-auto=update`) e popolato tramite `DatabaseSeeder.java`

---

## 2. Configurazione Docker

Il progetto è dockerizzato con tre servizi separati definiti in `docker-compose.yml`.

### 2.1 Variabili d'Ambiente

Le credenziali e le opzioni configurabili sono gestite tramite un file `.env` (mai committato su Git). Un template è fornito in `.env.example`.

| Variabile | Servizio | Descrizione |
|---|---|---|
| `MYSQL_ROOT_PASSWORD` | db | Password root MySQL |
| `MYSQL_DATABASE` | db | Nome del database (default: `vapestore`) |
| `DB_USER` | backend | Utente DB (default: `root`) |
| `DB_PASSWORD` | backend | Password DB |
| `UPLOAD_DIR` | backend | Percorso interno per i file caricati (default: `/app/uploads`) |
| `ALLOWED_ORIGINS` | backend | Origini CORS consentite, separate da virgola |

### 2.2 Dockerfile Backend (Multi-stage)

1. **Build stage** (`maven:3.9-eclipse-temurin-21`): compila il JAR con Maven
2. **Run stage** (`amazoncorretto:21-alpine-jdk`): immagine leggera che esegue solo il JAR

### 2.3 Dockerfile Frontend (Multi-stage)

1. **Build stage** (`node:18-alpine`): installa dipendenze e genera i file statici con `npm run build`
2. **Production stage** (`nginx:alpine`): serve i file statici e fa da reverse proxy

### 2.4 Nginx come Reverse Proxy

`nginx.conf` è configurato per:
- Servire la SPA React (con fallback a `index.html` per il routing client-side)
- Proxy `/api/` → `http://backend:8080/api/`
- Proxy `/uploads/` → `http://backend:8080/uploads/`

Questo permette al frontend di usare percorsi relativi (`/api`) senza hardcodare l'URL del backend.

> **Nota per deploy separati:** Se frontend e backend sono su piattaforme diverse, il proxy Nginx non è applicabile. In quel caso, aggiornare `frontend/src/apiConfig.js` con l'URL assoluto del backend e impostare `ALLOWED_ORIGINS` di conseguenza.

---

## 3. Struttura del Software e Funzionalità

### 3.1 Backend: Modelli e Logica

- **`Product`**: Entità ibrida per Liquidi e Hardware. Usa una tabella unica con campi specifici per categoria (`flavor`, `milliliters` per liquidi; `batteryType`, `wattage` per hardware).
- **`User`**: Gestisce gli accessi admin. Password cifrate con bcrypt.
- **`StoreSettings`**: Impostazioni globali per negozio: nome, logo, indirizzo, social.

**Controller:**
- `ProductController` (`/api/products`): CRUD prodotti + upload immagini. Implementa il "Shadow Sync" (clonazione automatica dei prodotti negli altri negozi).
- `AuthController` (`/api/auth/login`): Verifica credenziali e rilascia JWT.
- `SettingsController` (`/api/settings`): Lettura e aggiornamento impostazioni negozio.

### 3.2 Sicurezza

- **JWT Stateless:** Nessuna sessione server-side. Il token viene salvato nel `localStorage` del browser admin.
- **CORS esplicito:** Configurato tramite `CorsConfigurationSource` bean in `WebSecurityConfig`. Le origini consentite sono iniettabili via `ALLOWED_ORIGINS` (supporta lista separata da virgola).
- **Rotte pubbliche:** `GET /api/products/**`, `GET /api/settings/**`, `/uploads/**`, `/api/auth/**`
- **Rotte protette:** Tutto il resto richiede JWT valido.

### 3.3 Gestione Upload

I file caricati (loghi, immagini prodotto) sono salvati nella directory configurata tramite la variabile `upload.dir` (di default `/app/uploads` in Docker). Il path è esposto come risorsa statica su `/uploads/**` da `WebConfig.java`, senza richiedere autenticazione.

In Docker, la directory è mappata su un volume persistente (`uploads_data`) per sopravvivere ai riavvii del container.

### 3.4 Frontend: Componenti e Flusso Utente

- **`CustomerView`:** Vetrina pubblica con Infinite Scroll (Intersection Observer), ricerca testuale, filtri avanzati e carrello (Cart) isolato per store via localStorage.
- **`ProductDetail`:** Dettaglio singolo prodotto con tutte le specifiche.
- **`AdminDashboard`:** Pannello protetto da login JWT. Gestione prodotti, ricerca, creazione sotto-categorie, modifica `StoreSettings`.

---

## 4. Endpoint API

| Metodo | Rotta | Auth | Descrizione |
|---|---|---|---|
| POST | `/api/auth/login` | No | Login e rilascio JWT |
| GET | `/api/products` | No | Lista prodotti (con filtri opzionali) |
| GET | `/api/products/{id}` | No | Dettaglio prodotto |
| POST | `/api/products` | ✅ JWT | Crea prodotto |
| PUT | `/api/products/{id}` | ✅ JWT | Modifica prodotto |
| DELETE | `/api/products/{id}` | ✅ JWT | Elimina prodotto |
| POST | `/api/products/upload` | ✅ JWT | Upload immagine |
| GET | `/api/settings/{storeId}` | No | Leggi impostazioni negozio |
| PUT | `/api/settings/{storeId}` | ✅ JWT | Aggiorna impostazioni negozio |

---

## 5. Scelte Architetturali Ricorrenti

- **`apiConfig.js` con percorso relativo:** `getApiUrl()` restituisce `/api`. Funziona nativamente sia in Docker (grazie al proxy Nginx) sia in sviluppo locale (grazie al proxy di Vite in `vite.config.js`).
- **Dati di Sviluppo (`data.sql`):** Al boot, `DatabaseSeeder.java` inietta prodotti, store e admin per uno sviluppo rapido.
- **LAN Testing:** `vite.config.js` ha `server: { host: '0.0.0.0' }` per esporre il dev server sulla rete locale e testare da smartphone.
