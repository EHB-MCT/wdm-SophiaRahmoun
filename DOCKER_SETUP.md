# Selfie Analysis Pipeline - Docker Setup & Testing

## Quick Start

1. **Start Docker Desktop**
2. **Run the system**:
   ```bash
   docker compose up --build
   ```

## Verification Steps

### 1. Check Container Status
```bash
docker compose ps
# Expected: All 3 services (backend, admin-dashboard, db) running
```

### 2. Test Backend API
```bash
# Health check
curl http://localhost:3000

# Test selfie analysis
curl -X POST http://localhost:3000/api/selfie/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "faceDetected": true,
    "estimatedAge": 25,
    "gender": "male",
    "dominantEmotion": "happy",
    "brightness": 0.8,
    "backgroundClutter": 0.3,
    "deviceInfo": {"platform": "test"},
    "interactionDuration": 5000
  }'
```

### 3. Access Admin Dashboard
- URL: http://localhost:5173
- Should load user management interface

### 4. Run Mobile App
```bash
cd frontend-mobile
npm install
expo start
```

### 5. Test Mobile Flow
1. Take selfie
2. Click "Analyze" 
3. Check console logs
4. Verify data appears in admin dashboard

## Success Criteria
✅ Docker starts without errors
✅ Backend responds on port 3000
✅ Admin loads on port 5173
✅ Mobile can submit analysis
✅ Data flows: mobile → backend → mongo → admin