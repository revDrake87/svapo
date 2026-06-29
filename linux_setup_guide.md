# Guida per avviare il progetto su Linux

Questa guida copre due modalità: **Docker** (raccomandato, zero dipendenze da installare) e **sviluppo manuale** (per chi vuole modificare il codice in tempo reale).

---

## 🐳 Modalità 1: Docker (Raccomandato)

### Prerequisiti
Installa Docker Engine e il plugin Compose:

#### Debian / Ubuntu / Linux Mint
```bash
sudo apt update
sudo apt install -y docker.io docker-compose-plugin
sudo usermod -aG docker $USER   # permette di usare docker senza sudo
newgrp docker                   # applica il gruppo nella sessione corrente
```

#### Fedora
```bash
sudo dnf install -y docker docker-compose-plugin
sudo systemctl enable --now docker
sudo usermod -aG docker $USER
newgrp docker
```

#### Arch Linux / Manjaro
```bash
sudo pacman -S docker docker-compose
sudo systemctl enable --now docker
sudo usermod -aG docker $USER
newgrp docker
```

### Avvio

1. Clona il progetto:
   ```bash
   git clone https://github.com/revDrake87/svapo.git
   cd svapo
   ```

2. Configura le variabili d'ambiente:
   ```bash
   cp .env.example .env
   # Apri .env con un editor e imposta password sicure
   nano .env
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

### Prerequisiti

Installa **Java JDK 21**, **Node.js**, **Maven** e **MySQL**:

#### Debian / Ubuntu / Linux Mint
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y git maven openjdk-21-jdk mysql-server
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

#### Fedora
```bash
sudo dnf update -y
sudo dnf install -y git maven java-21-openjdk-devel nodejs community-mysql-server
```

#### Arch Linux / Manjaro
```bash
sudo pacman -Syu
sudo pacman -S git maven jdk21-openjdk nodejs npm mysql
```

### Configurazione MySQL

```bash
sudo systemctl start mysql
sudo mysql_secure_installation   # segui la procedura guidata
sudo mysql -u root -p
```

Nel prompt MySQL:
```sql
CREATE DATABASE vapestore;
EXIT;
```

### Scarica il progetto
```bash
git clone https://github.com/revDrake87/svapo.git
cd svapo
```

### Avvio del Backend

```bash
cd backend
./mvnw clean spring-boot:run
```

Al primo avvio Maven scaricherà le dipendenze. Il server sarà pronto quando vedrai `Tomcat started on port 8080`.

### Avvio del Frontend

Apri un **secondo terminale**:

```bash
cd frontend
npm install
npm run dev
```

### Accesso

- [http://localhost:5173/PROFESSIONAL_VAPE](http://localhost:5173/PROFESSIONAL_VAPE)
- [http://localhost:5173/PUFF_STORE](http://localhost:5173/PUFF_STORE)

> Puoi anche testare da smartphone connesso alla stessa rete Wi-Fi usando l'IP locale del tuo PC (es. `http://192.168.1.x:5173`).

---

## 🔐 Credenziali Admin

Aggiungi `/admin` all'URL (es. `http://localhost:5173/PROFESSIONAL_VAPE/admin`).

| Store | Username | Password |
|---|---|---|
| Professional Vape | `admin_prof` | `admin123` |
| Puff Store | `admin_puff` | `admin123` |
