# Selfie Analysis Pipeline

An educational project demonstrating how algorithmic systems create biased outcomes through indirect data collection when direct biometric access is unavailable.

## Conceptual Overview

This project illustrates the "data detour" phenomenon described in _Weapons of Math Destruction_: when systems cannot access real biometric data, they infer characteristics through behavioral and contextual proxies, leading to repetitive and biased conclusions.

**Why this matters:** Real face analysis APIs require expensive licensing and ethical approvals. Educational systems must therefore simulate analysis through indirect metrics (interaction time, device info, image metadata), which creates systematic bias and reinforces stereotypes.

## Architecture

- **Backend**: Node.js/Express API with MongoDB
- **Admin Dashboard**: React analytics interface
- **Mobile App**: React Native selfie capture and analysis
- **Database**: MongoDB for user profiles and analysis results

## Quick Start

### Prerequisites

- Docker and Docker Compose
- Node.js 18+
- Expo CLI (`npm install -g @expo/cli`)
  > Expo Go app installed on a mobile device (Android / iOS)

### Running the System

1. **Backend Services** (port 3001, admin on port 5173):

```bash
docker-compose up --build
```

2. **Mobile App** (requires separate terminal):

```bash
cd frontend-mobile
npm install
npx expo start
```

Scan the QR code with Expo Go app.

### Port Configuration

- **Backend API**: `http://localhost:3000`
- **Admin Dashboard**: `http://localhost:5173`
- **MongoDB**: `localhost:27017`
- **Mobile App**: Runs via Expo development server (QR code)

## What to Observe

### Admin Dashboard

- User profiling patterns
- Demographic clustering
- Analysis completion rates
- Device-based correlations

### Mobile Experience

- Deterministic "analysis" results
- Behavioral data collection (interaction time, retakes)
- Contextual profiling (device type, platform)
- Emotion-based UI theming

### Key Learning Points

1. **Proxy Data**: The system infers characteristics from device info, interaction patterns, and image metadata
2. **Reinforcement Loop**: Similar users receive similar "analysis" results, creating echo chambers
3. **Contextual Bias**: Platform, time, and device type influence outcomes

## Disclaimer

All analysis metrics are simulated for educational purposes. This system does not perform real face recognition or emotion detection. The project demonstrates how proxy-based systems can create biased outcomes, not to validate such approaches for real-world use.

## Academic Context

Created for [Course Name] as a critical exploration of algorithmic bias in biometric-adjacent systems. The implementation intentionally uses deterministic functions to highlight how "objective" analysis can reproduce systematic biases when based on indirect data signals.

## Project Standards

This project follows strict development standards and conventions. For detailed information about coding practices, architecture decisions, and project structure, see [`.github/PROJECT_STANDARDS.md`](.github/PROJECT_STANDARDS.md).

## Sources

### React Native & Expo

- https://reactnative.dev/docs/environment-setup
- https://docs.expo.dev/get-started/set-up-your-environment/
- https://medium.com/@dwinTech/how-to-set-up-env-for-a-react-native-app-337c3fba72af
- https://stackoverflow.com/questions/40985027/unable-to-resolve-module-in-react-native-app
- https://github.com/facebook/metro/issues/1337

### Docker & DevOps

- https://forums.docker.com/t/docker-for-windows-wont-launch/15725
- https://hub.docker.com/_/mongo-express
- https://stackoverflow.com/questions/69552636/cannot-launch-docker-desktop-for-mac
- https://www.docker.com/blog/how-to-dockerize-react-app/
- https://create-react-app.dev/docs/getting-started/

### Git & Version Control

- https://git-scm.com/docs/git-stash
- https://docs.github.com/fr/pull-requests/collaborating-with-pull-requests/addressing-merge-conflicts/resolving-a-merge-conflict-using-the-command-line
- https://stackoverflow.com/questions/22424142/error-your-local-changes-to-the-following-files-would-be-overwritten-by-checkou
- https://stackoverflow.com/questions/47241098/accept-incoming-change-not-appearing-in-vs-code
- https://stackoverflow.com/questions/47630950/how-can-i-switch-to-another-branch-in-git

### Face Analysis & Bias Research

- https://luxand.cloud/face-recognition-blog/guide-how-to-build-emotion-recognition-application-with-javascript
- https://justadudewhohacks.github.io/face-api.js/docs/index.html

### AI Assistance

- https://chatgpt.com/share/6959e29c-712c-8006-9a29-9e60854a798a

### General Resources

- https://www.aihr.com/blog/code-of-conduct-template/
