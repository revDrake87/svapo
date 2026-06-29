# Guida per avviare il progetto su macOS

Questa guida copre due modalità: **Docker** (raccomandato, zero dipendenze da installare) e **sviluppo manuale** (per chi vuole modificare il codice in tempo reale).

---

## 🐳 Modalità 1: Docker (Raccomandato)

### Prerequisiti
Installa [Docker Desktop per Mac](https://www.docker.com/products/docker-desktop/) (include Docker Compose). Avvialo dal Launchpad prima di procedere.

### Avvio

1. Clona il progetto:
   ```bash
   git clone https://github.com/revDrake87/svapo.git
   cd svapo
   ```

2. Configura le variabili d'ambiente:
   ```bash
   cp .env.example .env
   # Apri .env e imposta password sicure
   open -e .env
   ```

3. Avvia tutti i servizi:
   ```bash
   docker compose up -d --build
   ```

4. Accedi all'applicazione:
   - [http://localhost/PROFESSIONAL_VAPE](http://localhost/PROFESSIONAL_VAPE)
   - [http://localhost/PUFF_STORE](http://localhost/PUFF_STORE)

Per fermare:
```bash
docker compose down
```

Per vedere i log in tempo reale:
```bash
docker compose logs -f
```

---

## 🛠️ Modalità 2: Sviluppo Manuale (senza Docker)

### Fase 1: Installa Homebrew

Se non hai già Homebrew, aprì il **Terminale** e incolla:
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```
Segui le istruzioni a schermo. Alla fine, esegui i comandi che Homebrew ti mostra per aggiungere `brew` al PATH.

### Fase 2: Installa i Prerequisiti

```bash
brew update
brew install git maven node openjdk@21 mysql
```

Collega Java al sistema (Homebrew ti mostrerà il comando esatto nei "Caveats", il percorso cambia tra Intel e Apple Silicon):
```bash
# Apple Silicon (M1/M2/M3)
sudo ln -sfn /opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk-21.jdk

# Intel
sudo ln -sfn /usr/local/opt/openjdk@21/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk-21.jdk
```

### Fase 3: Configura MySQL

```bash
brew services start mysql
mysql_secure_installation   # segui la procedura guidata
mysql -u root -p
```

Nel prompt MySQL:
```sql
CREATE DATABASE vapestore;
EXIT;
```

### Fase 4: Scarica il progetto

```bash
git clone https://github.com/revDrake87/svapo.git
cd svapo
```

### Fase 5: Avvio del Backend

```bash
cd backend
./mvnw clean spring-boot:run
```

Al primo avvio Maven scaricherà le dipendenze. Il server sarà pronto quando vedrai `Tomcat started on port 8080`.

### Fase 6: Avvio del Frontend

Apri un **secondo terminale**:

```bash
cd frontend
npm install
npm run dev
```

### Accesso

- [http://localhost:5173/PROFESSIONAL_VAPE](http://localhost:5173/PROFESSIONAL_VAPE)
- [http://localhost:5173/PUFF_STORE](http://localhost:5173/PUFF_STORE)

> Puoi anche testare da iPhone/iPad connesso alla stessa rete Wi-Fi usando l'IP locale del tuo Mac (es. `http://192.168.1.x:5173`).

---

## 🔐 Credenziali Admin

Aggiungi `/admin` all'URL (es. `http://localhost:5173/PROFESSIONAL_VAPE/admin`).

| Store | Username | Password |
|---|---|---|
| Professional Vape | `admin_prof` | `admin123` |
| Puff Store | `admin_puff` | `admin123` |
