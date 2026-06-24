# Guida per avviare il progetto su Linux

Per far girare questo progetto su una distribuzione Linux (Debian/Ubuntu, Arch, Fedora, ecc.), è necessario installare gli strumenti di sviluppo principali: **Java (JDK) 21**, **Node.js**, **Maven** e **Git**.

Di seguito trovi i comandi per installare i prerequisiti sulle principali famiglie di distribuzioni Linux, e successivamente le istruzioni per avviare il progetto.

---

### Fase 1: Installazione dei Prerequisiti

Scegli i comandi in base alla tua distribuzione Linux:

#### 🟢 Debian / Ubuntu / Linux Mint
Apri il terminale ed esegui:
```bash
sudo apt update
sudo apt upgrade -y
# Installa Git, Maven e OpenJDK 21 (o 17)
sudo apt install -y git maven openjdk-21-jdk
# Installa Node.js (tramite NodeSource)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

#### 🔵 Fedora
Apri il terminale ed esegui:
```bash
sudo dnf update -y
# Installa Git, Maven, Node.js e OpenJDK 21
sudo dnf install -y git maven java-21-openjdk-devel nodejs
```

#### 🟣 Arch Linux / Manjaro
Apri il terminale ed esegui:
```bash
sudo pacman -Syu
# Installa Git, Maven, Node.js e OpenJDK 21
sudo pacman -S git maven jdk21-openjdk nodejs npm
```

---

### Fase 2: Scaricare il progetto
Scarica il progetto clonando la repository GitHub in una cartella a tua scelta (es. `~/Progetti`).
```bash
mkdir -p ~/Progetti
cd ~/Progetti
git clone https://github.com/revDrake87/svapo.git
cd svapo
```

---

### Fase 3: Configurare e avviare il Backend (Java)
Il backend utilizza Spring Boot.

**Avvia il Backend:**
Nel terminale, dentro la cartella del progetto:
```bash
cd backend
# Utilizziamo il wrapper maven incluso nel progetto per massima compatibilità
./mvnw clean spring-boot:run &
```
*(Al primo avvio, Maven scaricherà tutte le dipendenze necessarie. Finito il processo, vedrai un messaggio che indica che Tomcat è stato avviato sulla porta 8080).*

---

### Fase 4: Configurare e avviare il Frontend (React)
Il frontend necessita di Node.js e npm.

**Avvia il Frontend:**
Apri un *secondo* terminale (lasciando il backend in esecuzione nel primo) e vai nella cartella del progetto:
```bash
cd frontend
npm install
npm run dev &
```

---

🎉 **Finito!** Ora puoi aprire il tuo browser e andare su:
* Professional Vape: `http://localhost:5173/PROFESSIONAL_VAPE`
* Puff Store: `http://localhost:5173/PUFF_STORE`

Per la dashboard Admin aggiungi `/admin` (es. `http://localhost:5173/PROFESSIONAL_VAPE/admin`).
*   **User Professional:** `admin_prof` (Password: `admin123`)
*   **User Puff Store:** `admin_puff` (Password: `admin123`)

---

### 🗄️ (Opzionale) Passaggio a MySQL per la Produzione
Se desideri installare MySQL server sulla tua distribuzione Linux anziché usare il database in memoria H2:

*   **Debian/Ubuntu:** `sudo apt install mysql-server`
*   **Fedora:** `sudo dnf install mysql-server`
*   **Arch Linux:** `sudo pacman -S mariadb`

Dopo l'installazione, segui la guida dettagliata presente in `mysql_setup_guide.md` per configurare il database ed istruire il backend ad usarlo.
