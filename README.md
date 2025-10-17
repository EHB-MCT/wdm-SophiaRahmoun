# Portfolio


https://www.docker.com/blog/how-to-dockerize-react-app/ user to dockerise app
https://reactnative.dev/docs/environment-setup used to start react native app 
https://docs.expo.dev/get-started/set-up-your-environment/ used to set up environment 
https://medium.com/@dwinTech/how-to-set-up-env-for-a-react-native-app-337c3fba72af used to set up .env in app
https://www.mongodb.com/blog/post/quick-start-nodejs-mongodb-how-to-get-connected-to-your-database used to connect mongodb to node.js
https://www.makeareadme.com/ used to configure the readme

# Selfie Scanner App

A React Native mobile application that uses Machine learning to analyze a user's selfie and their environment.  
The backend is built with Node.js and MongoDB, and the project is being prepared for Docker deployment.

---

## 📱 About the Project

**AI Selfie Scanner App** is a prototype mobile app that allows a user to take a selfie and get feedback about:
- Their **emotion** (from facial analysis)
- The **light level** of their environment
- Their **user ID**

This is part of an ongoing student project focused on practical AI usage in mobile environments.

---

## 🛠️ Built With

### Frontend
- [React Native (Expo)](https://reactnative.dev/)
- JavaScript (ES6+)
- React Native Stylesheets

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose

### Dev Tools
- Dotenv
- Nodemon
- Postman
- Docker (coming soon)

---

## 🚀 Getting Started

### Prerequisites

- Node.js & npm
- MongoDB Atlas account
- Expo CLI (`npm install -g expo-cli`)
- VS Code or any preferred IDE

---

## ⚙️ Installation

### 1. Clone the repository
### 2. Set up backend 
cd backend 
npm install 

Create a .env file within the /backend with 
>MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/selfie_data_dev5?retryWrites=true&w=majority
PORT=5000

Start Backend : npm run dev

### 3. Setup frontend 
npm run dev 

### 4. setup frontend (expo app)

cd app
npm install 
expo start 


## Usage

- The app fetches analysis data from:
GET http://localhost:5000/api/analysis
- You can populate test data with:
POST http://localhost:5000/api/analysis/seed

## Project structure (backend)
 backend/
├── controllers/
│   └── analysisController.js
├── models/
│   └── Analysis.js
├── routes/
│   └── analysisRoutes.js
├── data/
│   └── fakeData.json
├── server.js
├── .env
└── package.json

## 🤝 Contributing
Pull requests are welcome. Please open an issue first to discuss what you’d like to change.
Make sure to test your changes and respect the existing structure (MVC, clear naming, consistent formatting).

## 🙌 Acknowledgments
This project is part of a student assignment at Erasmushogeschool Brussels.

Resources used:
- https://www.docker.com/blog/how-to-dockerize-react-app/ user to dockerise app
- https://reactnative.dev/docs/environment-setup used to start react native app 
- https://docs.expo.dev/get-started/set-up-your-environment/ used to set up environment 
- https://medium.com/@dwinTech/how-to-set-up-env-for-a-react-native-app-337c3fba72af used to set up .env in app
- https://www.mongodb.com/blog/post/quick-start-nodejs-mongodb-how-to-get-connected-to-your-database used to connect mongodb to node.js
- https://www.makeareadme.com/ used to configure the readme

## 📜 License

This project is licensed under the GNU General Public License.