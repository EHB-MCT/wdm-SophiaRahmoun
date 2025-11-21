# 📋 Project Standards – Selfie Scanner App

## Overzicht

Dit project is een mobiele applicatie gebouwd in **React Native (Expo)** met een eigen backend in **Node.js + Express** en **MongoDB Atlas**.  
Het doel is om via een selfie het gezicht en de omgeving van de gebruiker te analyseren.

De app toont voorlopig de volgende data:

- `userId`
- `emotion`
- `lightLevel`

---

## 🧱 Structuur

### 🔁 Backend

- **server.js**: start de Express-server en verbindt met MongoDB via `mongoose.connect()`
- **routes/**: bevat de API-routes, zoals `/api/analysis`
- **controllers/**: bevat de logica van elke route (bijv. ophalen en toevoegen van data)
- **models/**: definieert de datastructuur met Mongoose
- **data/fakeData.json**: bevat voorbeelddata voor tests
- **.env**: bevat geheime connectiegegevens zoals `MONGO_URI` en `PORT`

### 📱 Frontend

- Gebouwd met **React Native (Expo)**
- `fetch()` wordt gebruikt om API-data op te halen vanaf het backend

---

## 📦 Gebruikte technologieën

| Onderdeel   | Technologie         |
| ----------- | ------------------- |
| Frontend    | React Native (Expo) |
| Backend     | Node.js + Express   |
| Database    | MongoDB (Atlas)     |
| ORM         | Mongoose            |
| API-testing | Postman             |

---

## 🗃️ Data Model (voorlopig)(Analysis)

```json
{
	"userId": "U001",
	"emotion": "happy",
	"lightLevel": "low"
}
```
