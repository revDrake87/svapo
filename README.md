# Svapo Store Digital Catalog

Un catalogo digitale moderno e responsivo progettato per gestire le vetrine online di negozi fisici di sigarette elettroniche (svapo). L'applicazione, grazie alla sua architettura multi-tenant, permette di servire diversi negozi da un'unica piattaforma, offrendo funzionalità di scorrimento infinito, filtri per categorie, e un "Info & Social" dropdown per ottimizzare la visualizzazione su mobile.

L'interfaccia utente è progettata seguendo il pattern grafico minimalista di Vercel (font Inter, alto contrasto) con pieno supporto dinamico al Dark Mode e temi custom specifici per singolo negozio.

---

## 🌟 Funzionalità Principali

- **Multi-Store Architettura:** Supporto nativo per gestire più vetrine (es. Professional Vape, Puff Store) sulla stessa istanza tramite isolamento `storeId`.
- **Catalogo Condiviso (Shadow Sync):** I prodotti creati da un admin vengono clonati automaticamente (impostati come non disponibili) negli altri store per mantenere un database unificato ma indipendente.
- **Esperienza Utente Veloce:** Catalogo dotato di *Infinite Scroll*, ricerca full-text integrata e navigazione per categorie dinamiche.
- **Header Adattivo (Mobile First):** Info del negozio e link Social racchiusi in un menu a tendina intelligente per risparmiare spazio su schermi piccoli.
- **Pannello Admin Protetto:** Area riservata accessibile tramite autenticazione JWT, specifica per negozio.
- **Upload Media:** Caricamento locale e visualizzazione diretta di loghi negozio e immagini di prodotto.

---

## 🛠️ Stack Tecnologico

**Frontend:** React 19 + Vite · Tailwind CSS · React Router v6 · Lucide React · GSAP

**Backend:** Java 21 + Spring Boot 3.2 · Spring Security + JWT · Spring Data JPA (Hibernate) · MySQL

**Infrastruttura:** Docker + Docker Compose · Nginx (reverse proxy)

---

## 🚀 Avvio Rapido con Docker (raccomandato)

Assicurati di avere [Docker](https://docs.docker.com/get-docker/) e Docker Compose installati.

### 1. Configura le variabili d'ambiente

Copia il file di esempio e modifica le password:

```bash
cp .env.example .env
```

Apri `.env` e imposta password sicure per `MYSQL_ROOT_PASSWORD` e `DB_PASSWORD`. Non usare mai `root` o valori di default in produzione.

### 2. Avvia i servizi

```bash
docker-compose up -d --build
```

Questo comando compila il backend Java e il frontend React, avvia il database MySQL e mette tutto online.

### 3. Accedi all'applicazione

- [http://localhost/PROFESSIONAL_VAPE](http://localhost/PROFESSIONAL_VAPE)
- [http://localhost/PUFF_STORE](http://localhost/PUFF_STORE)

Per fermare tutto:

```bash
docker-compose down
```

> **Nota:** Il frontend è esposto sulla porta `80`. Il backend (porta `8080`) è accessibile dall'esterno solo per debug — in produzione puoi rimuovere il mapping `ports` dal servizio `backend` nel `docker-compose.yml`, poiché Nginx fa già da proxy per le chiamate API.

---

## 🛠️ Avvio in Sviluppo (senza Docker)

Consulta le guide dedicate al tuo sistema operativo:
- [Windows Setup Guide](windows_setup_guide.md)
- [Linux Setup Guide](linux_setup_guide.md)
- [macOS Setup Guide](mac_setup_guide.md)

**Backend:**
```bash
cd backend
./mvnw spring-boot:run
```

**Frontend** (in un secondo terminale):
```bash
cd frontend
npm install
npm run dev
```

Naviga su:
- `http://localhost:5173/PROFESSIONAL_VAPE`
- `http://localhost:5173/PUFF_STORE`

---

## 🔐 Accesso Admin

Aggiungi `/admin` all'URL del negozio (es. `http://localhost/PROFESSIONAL_VAPE/admin`).

| Store | Username | Password |
|---|---|---|
| Professional Vape | `admin_prof` | `admin123` |
| Puff Store | `admin_puff` | `admin123` |

> ⚠️ Cambia queste credenziali prima di andare in produzione.

---

## 🔧 Configurazione per la Produzione

### Variabili d'ambiente principali (`.env`)

| Variabile | Descrizione | Default |
|---|---|---|
| `MYSQL_ROOT_PASSWORD` | Password root MySQL | *(obbligatorio)* |
| `DB_PASSWORD` | Password DB per il backend | *(obbligatorio)* |
| `ALLOWED_ORIGINS` | Origini CORS consentite (separate da virgola) | `http://localhost` |
| `UPLOAD_DIR` | Percorso interno per i file caricati | `/app/uploads` |

### Deploy su servizi separati

Se frontend e backend vengono ospitati su piattaforme diverse (es. Railway per il backend, Vercel per il frontend):

1. Imposta `ALLOWED_ORIGINS` con il dominio del frontend (es. `https://miosito.com`).
2. In `frontend/src/apiConfig.js`, aggiorna `getApiUrl()` per restituire l'URL assoluto del backend invece di `/api`.
3. In quel caso, il blocco `location /api/` in `nginx.conf` non sarà utilizzato — il frontend chiamerà direttamente il backend.

---

## 📁 Struttura del Progetto

```
svapo/
├── backend/               # Spring Boot API
│   ├── src/
│   └── Dockerfile
├── frontend/              # React + Vite SPA
│   ├── src/
│   ├── nginx.conf
│   └── Dockerfile
├── docker-compose.yml
├── .env.example           # Template variabili d'ambiente
└── DOCUMENTATION.md       # Documentazione tecnica dettagliata
```
