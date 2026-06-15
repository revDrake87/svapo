# Setup Database MySQL per VapeStore

Questa guida contiene le istruzioni e lo script SQL per ricreare l'esatta struttura del database del tuo catalogo su un server MySQL reale.

## 1. Prerequisiti
Assicurati di avere installato MySQL Server sul tuo computer (Fedora o Windows).

## 2. Creazione del Database
Accedi alla riga di comando di MySQL o utilizza un client visivo (come DBeaver o phpMyAdmin) ed esegui i seguenti comandi per creare il database:

```sql
CREATE DATABASE IF NOT EXISTS vapestore;
USE vapestore;
```

## 3. Creazione della Tabella (Prompt SQL)
Esegui questo script per creare la struttura della tabella `product` con tutti i campi corretti che l'applicazione si aspetta:

```sql
CREATE TABLE product (
    instore_code BIGINT AUTO_INCREMENT PRIMARY KEY,
    barcode VARCHAR(255),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(255) NOT NULL, -- "LIQUIDO" o "HARDWARE"
    sub_category VARCHAR(255),
    purchase_price DOUBLE,
    retail_price DOUBLE NOT NULL,
    image_url VARCHAR(255),
    is_available BOOLEAN DEFAULT TRUE,
    
    -- Specifiche Liquidi
    milliliters INTEGER,
    flavor VARCHAR(255),
    ingredients VARCHAR(255),
    nicotine_strength VARCHAR(255),
    
    -- Specifiche Hardware
    color VARCHAR(255),
    battery_type VARCHAR(255),
    wattage INTEGER,
    tank_capacity DOUBLE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## 4. Connessione di Spring Boot a MySQL
Per dire al backend di usare questo nuovo database reale (invece di quello temporaneo H2), dovrai modificare il file `backend/src/main/resources/application.properties` con queste righe:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/vapestore?serverTimezone=UTC
spring.datasource.username=root
# Inserisci qui la tua vera password di MySQL
spring.datasource.password=TUA_PASSWORD
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA / Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect
```
