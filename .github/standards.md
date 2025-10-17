# React Native Project Standards – Selfie Data Recognition App

## Project Goal

Creating a mobile app in React Native that allows users to take a selfie. Based on that photo, the app will extract abstract and visible data (e.g., age, emotion, background objects, social status, light level…). As a "reward", the user receives skincare product suggestions. The actual goal is to raise awareness about how much data a selfie can reveal.

## 🔧 Tech Stack

- **Frontend:** React Native (using Expo)
- **Backend:** Node.js (hosted on Render)
- **Database:** MongoDB (cloud)
- **Language:** JavaScript
- **ML/AI:** Custom model trained separately (not integrated via AI SDKs)
- **Containerization:** Docker (multi-service setup using `docker-compose`)


## 🚀 Project Flow

1. User opens the app.
2. Takes a selfie using device camera.
3. Photo is sent to Node.js backend.
4. Backend processes the photo (face + abstract feature recognition).
5. Data is stored in MongoDB.
6. App displays:
   - Random skincare product suggestion.
   - All detected data (age, location, background info, etc.).

## 🧱 Project Structure

src/
├── assets/ # Images, icons, fonts
├── components/ # Reusable UI components
├── screens/ # App pages (Home, Camera, Result)
├── services/ # API calls to backend
├── types/ # TypeScript types (if used)
├── utils/ # Helper functions
├── App.js # Entry point
└── index.js # Root

## 🧑‍💻 Coding Conventions

### General Rules

- Use `const` and `let` only (no `var`).
- Use **functional components only**.
- Separate components, no nesting in render methods.

### Naming

- `PascalCase` → for components
- `camelCase` → for functions, variables
- `CONSTANT_CASE` → for constants and global config

### Styling

- No inline styles
- Use `StyleSheet.create`
- Shared base styles in separate files

### Example

```js
const styles = StyleSheet.create({
	titleText: {
		fontSize: 18,
		color: "black",
		fontFamily: "Inter-Medium",
		textAlign: "center",
	},
});
```
