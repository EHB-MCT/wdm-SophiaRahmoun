# Selfie Analysis Pipeline

A fully local selfie analysis system with no external API dependencies, running via Docker Compose.

## Architecture

- **Backend** (Node.js + Express + MongoDB): Local face analysis using face-api.js
- **Frontend Mobile** (Expo React Native): Selfie capture and analysis
- **Admin Dashboard** (Vite + React): User management and analytics
- **Database** (MongoDB): Storing users, analyses, and events

## Features

### Backend (/backend)
- **Face Analysis**: Local face detection, age/gender estimation, emotion recognition
- **Image Metrics**: Brightness calculation and background clutter detection
- **User Management**: Persistent UID generation and tracking
- **Admin APIs**: User listing, detailed analytics, and filtering

### Frontend Mobile (/frontend-mobile)
- **Camera Integration**: Front-facing camera selfie capture
- **Analysis Upload**: POST to `/api/selfie/analyze` with optional UID
- **UI Theming**: Dynamic theming based on age, emotion, and brightness
- **Local Storage**: UID persistence using SecureStore

### Admin Dashboard (/admin-dashboard)
- **User Listing**: All users with selfie counts and metadata
- **User Details**: Individual analysis history and events
- **Analytics**: Aggregated insights with filtering capabilities
- **Data Visualization**: Emotion/gender distribution charts

## Quick Start

### Prerequisites
- Docker and Docker Compose
- Git

### Setup

1. **Clone and navigate:**
   ```bash
   git clone <repository-url>
   cd wdm-SophiaRahmoun
   ```

2. **Setup Face API Models:**
   ```bash
   # Download face-api.js models to backend/models/
   mkdir -p backend/models
   
   # Required model files (download from face-api.js GitHub):
   # - tiny_face_detector_model-manifest.json
   # - tiny_face_detector_model.weights
   # - age_gender_net-manifest.json  
   # - age_gender_model.weights
   # - face_expression_model-manifest.json
   # - face_expression_model.weights
   
   # Alternative: Use a download script or manual download from:
   # https://github.com/justadudewhohacks/face-api.js/tree/master/weights
   ```

3. **Environment Configuration:**
   ```bash
   # Copy environment template
   cp .env.template .env
   
   # Update if needed (defaults work for Docker)
   ```

4. **Start the system:**
   ```bash
   docker compose up --build
   ```

5. **Access the applications:**
   - **Backend API**: http://localhost:3000
   - **Admin Dashboard**: http://localhost:5173
   - **Mobile App**: Run `expo start` in `frontend-mobile/`

## API Endpoints

### Selfie Analysis
- `POST /api/selfie/analyze`
  - **Body**: multipart/form-data with `image` file and optional `uid`
  - **Response**: Analysis results with UID (generated if not provided)

### Admin APIs
- `GET /api/admin/users` - List all users with basic stats
- `GET /api/admin/users/:uid` - User detail with analyses and events
- `GET /api/admin/analytics` - Aggregated analytics with filters

## Database Schema

### Users
- `uid`: Unique identifier
- `createdAt`, `lastSeen`: Timestamps
- `selfieCount`: Number of analyses
- `deviceInfo`: Future expansion

### SelfieAnalyses
- `uid`: User reference
- `imageUrl`: Path to stored image
- Face analysis: `faceDetected`, `estimatedAge`, `gender`, `dominantEmotion`
- Image metrics: `brightness`, `backgroundClutter`
- Speculative metrics: `speculativeBMI`, `speculativeSocialClass`

### Events
- `uid`: User reference
- `type`: `navigation`, `click`, `selfie_upload`, `analysis_complete`
- `data`: Event-specific data
- `timestamp`: Event time

## Docker Configuration

### Services
- **backend**: Node.js 18 LTS with canvas build dependencies
- **admin-dashboard**: Vite dev server with hot reload
- **db**: MongoDB 7 with persistent data volume

### Volumes
- `mongo_data`: MongoDB persistence
- `./backend/uploads:/app/uploads`: Image uploads
- `./backend/models:/app/models`: Face API models

## Mobile Development

### Running the Expo App
```bash
cd frontend-mobile
npm install
expo start
```

### Features
- Camera permissions handling
- Real-time preview
- Image upload with progress
- Dynamic UI theming based on results
- Secure UID storage

## Admin Dashboard

### Features
- User management with filtering
- Individual user analysis history
- Real-time analytics dashboard
- Responsive design
- Data visualization

### Filtering Options
- Age ranges: 18-25, 26-35, 36-50, 51+
- Emotions: happy, sad, angry, neutral
- Date ranges: 7 days, 30 days, 90 days

## Development

### Branch Strategy
- `main`: Production-ready stable code
- `develop`: Integration branch
- `feature/*`: Individual features
- All commits follow Conventional Commits format

### Commit Messages
```
feat(scope): description
fix(scope): description  
chore(scope): description
docs(scope): description
```

### Testing Pipeline
```bash
# Test complete pipeline
docker compose up --build

# Individual service testing
docker compose up backend
docker compose up admin-dashboard
```

## Notes

### Face Analysis Models
The system requires face-api.js model files in `backend/models/`. The models are:
- Tiny Face Detector (smaller, faster)
- Age & Gender Recognition
- Face Expression Recognition

### Speculative Metrics
BMI and social class metrics are clearly labeled as speculative/fake and use random heuristics. These are placeholder implementations for demonstration purposes.

### Performance Considerations
- Face analysis runs locally but requires models to be loaded first
- Image processing uses canvas for pixel manipulation
- MongoDB indexes should be added for production use

## Troubleshooting

### Common Issues
1. **Models not loading**: Ensure model files are in `backend/models/`
2. **Canvas build errors**: Docker includes required build dependencies
3. **Mongo connection**: Ensure `db` service is running before `backend`
4. **Upload errors**: Check file size limits and directory permissions

### Debug Commands
```bash
# Check service logs
docker compose logs backend
docker compose logs admin-dashboard

# Check MongoDB connection
docker compose exec db mongo selfie_analysis

# Restart specific service
docker compose restart backend
```

## License

Educational use only. Face analysis and speculative metrics should not be used for production decision-making.