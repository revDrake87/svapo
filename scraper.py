import urllib.request
import re
import html

urls_to_scrape = [
    ("https://www.svapoebasta.com/207-aromi-concentrati", "LIQUIDO", "AROMA"),
    ("https://www.svapoebasta.com/171-liquidi-sigaretta-elettronica", "LIQUIDO", "TPD"),
    ("https://www.svapoebasta.com/1643-liquidi-mix-and-vape", "LIQUIDO", "SHOT"),
    ("https://www.svapoebasta.com/385-liquidi-scomposti-mini-shot", "LIQUIDO", "MINI_SHOT_10_10"),
    ("https://www.svapoebasta.com/468-nicotina", "LIQUIDO", "NICOTINE_SHOT"),
    ("https://www.svapoebasta.com/170-sigarette-elettroniche", "HARDWARE", "STARTER_KIT"),
    ("https://www.svapoebasta.com/169-Atomizzatori", "HARDWARE", "ATOMIZER_NON_RTA")
]

all_inserts = []
barcode_seed = 8051234500000

for idx, (url, category, subcategory) in enumerate(urls_to_scrape):
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
        response = urllib.request.urlopen(req)
        html_content = response.read().decode('utf-8', errors='ignore')
        
        # Estraiamo i blocchi di prodotto, splittiamo su <article
        articles = html_content.split('<article')[1:]
        
        count = 0
        for block in articles:
            if count >= 15: # Prendi 15 prodotti per categoria
                break
            
            # extract image src
            img_match = re.search(r'data-full-size-image-url="([^"]+)"', block)
            if not img_match:
                img_match = re.search(r'<img[^>]+src="([^"]+)"', block)
            if not img_match:
                continue
            img_url = img_match.group(1)
            
            # extract title
            title_match = re.search(r'alt="([^"]+)"', block)
            title = "Prodotto Sconosciuto"
            if title_match:
                title = html.unescape(title_match.group(1)).replace("'", "''")
            
            # extract price
            price_match = re.search(r'class="product-price" content="([\d\.]+)"', block)
            price = 10.0
            if price_match:
                price = float(price_match.group(1))
                
            purchase_price = round(price * 0.6, 2)
            
            ml = "10" if category == "LIQUIDO" else "NULL"
            
            barcode = str(barcode_seed)
            barcode_seed += 1
            
            for store in ['PROFESSIONAL_VAPE', 'PUFF_STORE']:
                insert = f"INSERT INTO product (store_id, barcode, name, milliliters, category, sub_category, purchase_price, retail_price, description, image_url) VALUES ('{store}', '{barcode}', '{title}', {ml}, '{category}', '{subcategory}', {purchase_price}, {price}, '{title}', '{img_url}');"
                all_inserts.append(insert)
            
            count += 1
            
    except Exception as e:
        print(f"Error scraping {url}: {e}")

# Sovrascriviamo gli insert correnti di prodotto mantenendo i settings e gli users
with open('backend/src/main/resources/data.sql', 'r') as f:
    sql_content = f.read()

# Rimuovo le righe della tabella product alla fine
sql_content = re.sub(r"INSERT INTO product.*?;\n*", "", sql_content, flags=re.DOTALL)

with open('backend/src/main/resources/data.sql', 'w') as f:
    f.write(sql_content.strip() + "\n\n")
    f.write("\n".join(all_inserts))

print(f"Generated {len(all_inserts)} items into data.sql")
