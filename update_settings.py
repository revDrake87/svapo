import requests

prof_data = {
    "storeName": "Professional Vape",
    "address": "Via Roma 1",
    "instagram": "https://instagram.com/prof"
}
requests.put("http://localhost:8080/api/settings/prof", json=prof_data)

puff_data = {
    "storeName": "Puff Store",
    "address": "Via Milano 2",
    "whatsapp": "1234567890"
}
requests.put("http://localhost:8080/api/settings/puff", json=puff_data)
