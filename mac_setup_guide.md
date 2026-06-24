# Guida per avviare il progetto su macOS

Per far girare questo progetto su un computer Mac, ti consigliamo di utilizzare **Homebrew** (il gestore di pacchetti standard per macOS) per installare in modo pulito gli strumenti necessari: **Java (JDK) 21**, **Node.js**, **Maven** e **Git**.

---

### Fase 1: Installare Homebrew
Se non hai già installato Homebrew, apri l'applicazione **Terminale** e incolla questo comando:
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```
*Segui le istruzioni a schermo. Alla fine dell'installazione, il terminale potrebbe chiederti di eseguire un paio di comandi per aggiungere `brew` al tuo PATH.*

---

### Fase 2: Installare i Prerequisiti
Con Homebrew installato, l'installazione dei tool è facilissima. Nel Terminale, esegui:
```bash
# Aggiorna brew
brew update

# Installa Git, Maven, Node.js e Java 21
brew install git maven node openjdk@21
```

*Nota su Java:* Homebrew installa Java in una cartella di sistema. Per fare in modo che macOS lo riconosca come versione principale, devi creare un symlink. Esegui questo comando:
```bash
sudo ln -sfn /usr/local/opt/openjdk@21/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk-21.jdk
```
*(Se usi un Mac con chip Apple Silicon (M1/M2/M3), il percorso potrebbe essere `/opt/homebrew/opt/openjdk@21/...`. Homebrew ti mostrerà il comando esatto nei "Caveats" dopo l'installazione).*

---

### Fase 3: Scaricare il progetto
Spostati nella cartella in cui vuoi salvare il progetto (ad esempio sulla Scrivania) e clonalo:
```bash
cd ~/Desktop
git clone https://github.com/revDrake87/svapo.git
cd svapo
```

---

### Fase 4: Configurare e avviare il Backend (Java)
Il backend utilizza Spring Boot.

**Avvia il Backend:**
Nel terminale, dentro la cartella del progetto, esegui:
```bash
cd backend
# Utilizziamo il wrapper maven incluso nel progetto per massima compatibilità
./mvnw clean spring-boot:run &
```
*(Al primo avvio, Maven scaricherà tutte le dipendenze. Finito il processo, vedrai un messaggio che indica che Tomcat è stato avviato sulla porta 8080).*

---

### Fase 5: Configurare e avviare il Frontend (React)
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
Se desideri usare MySQL reale al posto del database H2:

1. Installalo tramite Homebrew:
   ```bash
   brew install mysql
   ```
2. Avvialo come servizio in background:
   ```bash
   brew services start mysql
   ```
3. Segui la guida dettagliata presente in `mysql_setup_guide.md` per creare il database e connettere il backend.
