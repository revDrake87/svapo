# Guida per avviare il progetto su Windows

Per far girare questo progetto su un computer Windows, è necessario installare gli strumenti di sviluppo (Java, Maven, Node.js e Git). Segui questi passaggi nell'ordine indicato.

---

### Fase 1: Scaricare il progetto con Git
Se non hai Git installato su Windows, scaricalo da [git-scm.com](https://git-scm.com/download/win) e installalo lasciando le opzioni predefinite.
1. Apri il **Terminale** (o PowerShell) su Windows.
2. Vai nella cartella dove vuoi salvare il progetto (es. Documenti):
   ```cmd
   cd Documenti
   ```
3. Clona il progetto da GitHub:
   ```cmd
   git clone https://github.com/revDrake87/svapo.git
   cd svapo
   ```

---

### Fase 2: Configurare e avviare il Backend (Java)
Il backend ha bisogno di **Java (JDK) 21** (o 17) e **Maven**. 

**1. Installa Java JDK:**
* Vai sul sito di [Eclipse Temurin (Adoptium)](https://adoptium.net/) o usa il download di Oracle.
* Scarica l'installer per Windows della versione **21 LTS** (o 17 LTS).
* **IMPORTANTE durante l'installazione:** Assicurati di spuntare la casella "Set JAVA_HOME variable" (Imposta variabile JAVA_HOME), altrimenti Maven non troverà Java!

**2. Installa Maven:**
* L'approccio più semplice su Windows è scaricare lo zip da [maven.apache.org](https://maven.apache.org/download.cgi) (es. `apache-maven-3.9.x-bin.zip`).
* Estrai lo zip in `C:\maven`.
* Aggiungi Maven al Path di Windows:
  * Cerca "Variabili d'ambiente" nel menu Start di Windows e apri le impostazioni.
  * Vai su "Variabili d'ambiente...".
  * Sotto "Variabili di sistema", trova **Path**, selezionala e clicca Modifica.
  * Clicca "Nuovo" e aggiungi `C:\maven\bin`.
  * Clicca OK su tutto e **riavvia il terminale**.
* Per verificare che funzioni, apri il terminale e digita: `mvn -version`.

**3. Avvia il Backend:**
Nel terminale, dentro la cartella del progetto:
```cmd
cd backend
mvn clean spring-boot:run
```
*(Al primo avvio, Maven scaricherà internet intero. È normale che ci metta un po'. Finito il processo, vedrai "Tomcat started on port 8080").*

---

### Fase 3: Configurare e avviare il Frontend (React)
Il frontend necessita di **Node.js**.

**1. Installa Node.js:**
* Vai su [nodejs.org](https://nodejs.org/) e scarica la versione **LTS** per Windows.
* Avvia l'installer e prosegui sempre con "Avanti" (lascia le impostazioni di default).
* Al termine, **apri un NUOVO terminale**.

**2. Avvia il Frontend:**
In un terminale diverso da quello del backend, vai nella cartella del progetto:
```cmd
cd frontend
npm install
npm run dev
```

---

🎉 **Finito!** Ora puoi aprire il tuo browser e andare su:
* Professional Vape: `http://localhost:5173/PROFESSIONAL_VAPE`
* Puff Store: `http://localhost:5173/PUFF_STORE`

Per la dashboard Admin aggiungi `/admin` (es. `http://localhost:5173/PROFESSIONAL_VAPE/admin`).
*   **User Professional:** `admin_prof` (Password: `admin123`)
*   **User Puff Store:** `admin_puff` (Password: `admin123`)