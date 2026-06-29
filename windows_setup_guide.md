# Guida per avviare il progetto su Windows

Questa guida copre due modalità: **Docker** (raccomandato, zero dipendenze da installare) e **sviluppo manuale** (per chi vuole modificare il codice in tempo reale).

---

## 🐳 Modalità 1: Docker (Raccomandato)

### Prerequisiti
Installa [Docker Desktop per Windows](https://www.docker.com/products/docker-desktop/). Richiede Windows 10/11 con WSL2 abilitato (Docker Desktop ti guida nell'installazione di WSL2 se non è già presente). Avvia Docker Desktop prima di procedere.

### Avvio

1. Apri **PowerShell** o il **Terminale Windows** e clona il progetto:
   ```powershell
   git clone https://github.com/revDrake87/svapo.git
   cd svapo
   ```

2. Configura le variabili d'ambiente:
   ```powershell
   copy .env.example .env
   notepad .env
   ```
   Imposta password sicure per `MYSQL_ROOT_PASSWORD` e `DB_PASSWORD`, poi salva.

3. Avvia tutti i servizi:
   ```powershell
   docker compose up -d --build
   ```

4. Accedi all'applicazione:
   - [http://localhost/PROFESSIONAL_VAPE](http://localhost/PROFESSIONAL_VAPE)
   - [http://localhost/PUFF_STORE](http://localhost/PUFF_STORE)

Per fermare:
```powershell
docker compose down
```

Per vedere i log in tempo reale:
```powershell
docker compose logs -f
```

---

## 🛠️ Modalità 2: Sviluppo Manuale (senza Docker)

### Fase 1: Installa Git

Scarica e installa [Git per Windows](https://git-scm.com/download/win) lasciando le opzioni predefinite. Apri **Git Bash** o **PowerShell** per i comandi successivi.

### Fase 2: Installa Java JDK 21

1. Vai su [Adoptium (Eclipse Temurin)](https://adoptium.net/) e scarica l'installer **Windows x64** per la versione **21 LTS**.
2. Durante l'installazione, assicurati di spuntare **"Set JAVA_HOME variable"** — altrimenti Maven non troverà Java.
3. Verifica: apri un nuovo terminale e digita `java -version`.

### Fase 3: Installa Maven

1. Scarica lo zip `apache-maven-3.9.x-bin.zip` da [maven.apache.org](https://maven.apache.org/download.cgi).
2. Estrailo in `C:\maven`.
3. Aggiungi Maven al PATH:
   - Cerca **"Variabili d'ambiente"** nel menu Start.
   - Sotto **Variabili di sistema**, trova `Path` → Modifica → Nuovo → aggiungi `C:\maven\bin`.
   - Clicca OK su tutto e **riapri il terminale**.
4. Verifica: `mvn -version`.

### Fase 4: Installa Node.js

1. Scarica la versione **LTS** da [nodejs.org](https://nodejs.org/).
2. Avvia l'installer con le impostazioni di default.
3. Verifica (in un nuovo terminale): `node -v`.

### Fase 5: Installa MySQL

1. Scarica **MySQL Installer** da [dev.mysql.com](https://dev.mysql.com/downloads/installer/).
2. Scegli l'opzione "Developer Default" o "Server only".
3. Durante la configurazione, imposta una password per l'utente `root`.
4. Al termine, apri MySQL Command Line Client e crea il database:
   ```sql
   CREATE DATABASE vapestore;
   EXIT;
   ```

### Fase 6: Scarica il progetto

```powershell
git clone https://github.com/revDrake87/svapo.git
cd svapo
```

### Fase 7: Avvio del Backend

```powershell
cd backend
mvn clean spring-boot:run
```

Al primo avvio Maven scaricherà le dipendenze — è normale che ci voglia qualche minuto. Il server è pronto quando vedi `Tomcat started on port 8080`.

### Fase 8: Avvio del Frontend

Apri un **secondo terminale**:

```powershell
cd frontend
npm install
npm run dev
```

### Accesso

- [http://localhost:5173/PROFESSIONAL_VAPE](http://localhost:5173/PROFESSIONAL_VAPE)
- [http://localhost:5173/PUFF_STORE](http://localhost:5173/PUFF_STORE)

---

## 🔐 Credenziali Admin

Aggiungi `/admin` all'URL (es. `http://localhost:5173/PROFESSIONAL_VAPE/admin`).

| Store | Username | Password |
|---|---|---|
| Professional Vape | `admin_prof` | `admin123` |
| Puff Store | `admin_puff` | `admin123` |
