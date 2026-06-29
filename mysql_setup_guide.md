# Setup Database MySQL per VapeStore

Questa guida è utile solo se stai eseguendo il progetto **senza Docker** e vuoi connettere il backend a un'istanza MySQL locale.

> Se usi Docker (`docker compose up`), il database MySQL è già configurato automaticamente — puoi ignorare questa guida.

---

## 1. Crea il database

Accedi alla shell MySQL:
```bash
mysql -u root -p
```

Esegui:
```sql
CREATE DATABASE IF NOT EXISTS vapestore CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

---

## 2. Struttura delle tabelle

Lo schema viene creato automaticamente da Hibernate all'avvio del backend (`ddl-auto=update`). Non è necessario eseguire manualmente gli script DDL.

Se preferisci crearla manualmente, ecco la struttura:

```sql
USE vapestore;

CREATE TABLE product (
    instore_code BIGINT AUTO_INCREMENT PRIMARY KEY,
    barcode VARCHAR(255),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(255) NOT NULL,
    sub_category VARCHAR(255),
    purchase_price DOUBLE,
    retail_price DOUBLE NOT NULL,
    image_url VARCHAR(255),
    is_available BOOLEAN DEFAULT TRUE,
    milliliters INTEGER,
    flavor VARCHAR(255),
    ingredients VARCHAR(255),
    nicotine_strength VARCHAR(255),
    color VARCHAR(255),
    battery_type VARCHAR(255),
    wattage INTEGER,
    tank_capacity DOUBLE,
    store_id VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    store_id VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE store_settings (
    id VARCHAR(255) PRIMARY KEY,
    store_name VARCHAR(255),
    logo_url VARCHAR(255),
    address VARCHAR(255),
    instagram VARCHAR(255),
    facebook VARCHAR(255),
    tiktok VARCHAR(255),
    whatsapp VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

---

## 3. Connetti il backend a MySQL

Modifica `backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/vapestore?serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=TUA_PASSWORD_MYSQL
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect
```

> **Sicurezza:** Non committare mai password reali nel file `application.properties`. Preferisci passarle come variabili d'ambiente (`DB_PASSWORD`) che il file legge già tramite `${DB_PASSWORD:root}`.

---

## 4. Avvia il backend

```bash
cd backend
./mvnw clean spring-boot:run
```

Al primo avvio, Hibernate creerà le tabelle e `DatabaseSeeder.java` le popolerà con i dati di esempio.
