# Svapo Store Digital Catalog

Un catalogo digitale moderno e responsivo progettato per gestire le vetrine online di negozi fisici di sigarette elettroniche (svapo). L'applicazione, grazie alla sua architettura multi-tenant, permette di servire diversi negozi da un'unica piattaforma, offrendo funzionalità di scorrimento infinito, filtri per categorie, e un "Info & Social" dropdown per ottimizzare la visualizzazione su mobile.

L'interfaccia utente è progettata seguendo il pattern grafico minimalista di Vercel (font Inter, alto contrasto) con pieno supporto dinamico al Dark Mode e temi custom specifici per singolo negozio (es. Header fisso per Puff Store).

## 🌟 Funzionalità Principali

*   **Multi-Store Architettura:** Supporto nativo per gestire più vetrine (es. Professional Vape, Puff Store) sulla stessa istanza tramite isolamento `storeId`.
*   **Catalogo Condiviso (Shadow Sync):** I prodotti creati da un admin vengono clonati automaticamente (impostati come non disponibili) negli altri store per mantenere un database unificato ma indipendente.
*   **Esperienza Utente Veloce:** Catalogo dotato di *Infinite Scroll* per scorrere senza latenze, ricerca full-text integrata e navigazione per categorie dinamiche.
*   **Header Adattivo (Mobile First):** Info del negozio e link Social racchiusi in un menu a tendina intelligente per risparmiare spazio su schermi piccoli. Il design reagisce al `isThemeFixed` del negozio, adattando colori e contrasto.
*   **Pannello Admin Protetto:** Area riservata accessibile tramite autenticazione JWT, specifica per negozio (es. login con `admin_prof` o `admin_puff`).
*   **Upload Media:** Caricamento locale e visualizzazione diretta nel front-end di loghi negozio e immagini di prodotto, tramite un modulo `MultipartFile` aperto e protetto correttamente da CORS e Spring Security.

## 🛠️ Stack Tecnologico

**Frontend:**
*   React 19 + Vite
*   Tailwind CSS (Styling custom Vercel-like & CSS Variables per il theming di negozi multipli)
*   React Router v6
*   Lucide React & GSAP

**Backend:**
*   Java 21 + Spring Boot 3.2
*   Spring Security + JWT
*   Spring Data JPA (Hibernate)
*   Database: MySQL (sia in sviluppo che in produzione)

## 🚀 Come avviare il progetto localmente (Docker)

Il modo più semplice e raccomandato per avviare l'intero stack (Frontend, Backend e Database MySQL) è tramite Docker.

### Avvio Rapido con Docker

Assicurati di avere [Docker](https://docs.docker.com/get-docker/) e Docker Compose installati sul tuo sistema.

1.  Apri il terminale nella root del progetto.
2.  Esegui il comando:
    ```bash
    docker-compose up -d --build
    ```
    *(Questo comando scaricherà le immagini necessarie, compilerà il backend Java e il frontend React, avvierà il database MySQL, e poi avvierà l'applicazione).*

3.  L'applicazione sarà accessibile all'indirizzo:
    - [http://localhost/PROFESSIONAL_VAPE](http://localhost/PROFESSIONAL_VAPE)
    - [http://localhost/PUFF_STORE](http://localhost/PUFF_STORE)

*(Nota: su Docker il frontend è esposto sulla porta standard 80, mentre il backend comunica internamente e non espone direttamente la porta 8080)*.

Per fermare l'applicazione, esegui:
```bash
docker-compose down
```

## 🛠️ Come avviare il progetto localmente (Sviluppo Senza Docker)

Consulta le guide di setup dedicate al tuo sistema operativo:
- [Windows Setup Guide](windows_setup_guide.md)
- [Linux Setup Guide](linux_setup_guide.md)
- [macOS Setup Guide](mac_setup_guide.md)

### Avvio Rapido

**1. Avvio del Backend:**
Run `./mvnw spring-boot:run` in the `backend` directory.

*(Il server backend è in ascolto su `http://localhost:8080`, servendo le API RESTful e i file caricati nella cartella `/uploads`).*

**2. Avvio del Frontend:**
Run `npm run dev -- --host` in the `frontend` directory (oppure usa solo `npm run dev`, dato che il file di configurazione è già predisposto per esporre la webapp sulla rete interna).

*(Nota: in questo modo puoi testare l'app da smartphone connettendoti all'indirizzo IP locale del tuo computer, es. `http://192.168.1.x:5173`).*

*Naviga a:*
- *[http://localhost:5173/PROFESSIONAL_VAPE](http://localhost:5173/PROFESSIONAL_VAPE) - Per lo store "Professional Vape"*
- *[http://localhost:5173/PUFF_STORE](http://localhost:5173/PUFF_STORE) - Per lo store "Puff Store"*

## 🔐 Accesso Admin
Per la dashboard aggiungi `/admin` (es. `http://localhost:5173/PROFESSIONAL_VAPE/admin`).
*   **User Professional:** `admin_prof` (Password: `admin123`)
*   **User Puff Store:** `admin_puff` (Password: `admin123`)
