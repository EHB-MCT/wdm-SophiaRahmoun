# Selfie Analysis Pipeline - Testing Checklist

## Prerequisites

1. **Start Docker Desktop** (required for daemon)
2. **Run the system**:
   ```bash
   docker compose up --build
   ```

## Manual Testing Steps

### 1. Backend API Testing

**Test backend health:**
```bash
curl http://localhost:3000
# Expected: "API is running"
```

**Test selfie analysis endpoint:**
```bash
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
# Expected: User data with UID and analysis confirmation
```

**Test event recording:**
```bash
curl -X POST http://localhost:3000/api/selfie/event \
  -H "Content-Type: application/json" \
  -d '{
    "uid": "test-uid",
    "type": "navigation",
    "data": {"page": "test"}
  }'
# Expected: Event recording confirmation
```

### 2. Admin Dashboard Testing

**Access admin dashboard:**
- URL: http://localhost:5173
- Expected: User list page loads
- Check: User data appears after analysis submissions

**Test filtering:**
- Age range filter: Select "18-25"
- Emotion filter: Select "happy"
- Date range: Select "Last 7 days"
- Expected: Filtered results update correctly

### 3. Mobile App Testing

**Setup mobile app:**
```bash
cd frontend-mobile
npm install
expo start
```

**Test selfie flow:**
1. Open camera screen
2. Grant camera permissions
3. Take selfie
4. Tap "Analyze" button
5. Check console logs for data flow
6. Verify analysis results display
7. Check UI theming changes based on results

**Expected mobile console logs:**
```
📊 Performing mock face analysis on: [image-uri]
📈 Calculating mock image metrics for: [image-uri]
📤 Sending analysis data: [analysis-object]
✅ Analysis saved for user [uid]: {...}
```

### 4. Data Flow Verification

**MongoDB connection:**
```bash
# Connect to MongoDB
docker compose exec db mongosh selfie_analysis

# Check collections
show collections
db.users.find().pretty()
db.selfieanalyses.find().pretty()
db.events.find().pretty()
```

**Expected MongoDB data:**
- Users collection: Document with UID and metadata
- SelfieAnalyses collection: Analysis results with timestamps
- Events collection: Navigation and interaction events

## End-to-End Flow Test

1. **Mobile** → Take selfie → Mock analysis
2. **Mobile** → Send data to backend
3. **Backend** → Validate and store in MongoDB
4. **Admin** → Display user with new analysis
5. **Console** → Show pipeline logs at each step

## Troubleshooting

### Docker Issues
```bash
# Check service logs
docker compose logs backend
docker compose logs admin-dashboard
docker compose logs db

# Restart specific service
docker compose restart backend
```

### Port Conflicts
- Backend: 3000
- Admin: 5173
- MongoDB: 27017

### Common Solutions
1. **"Cannot connect to Docker daemon"**: Start Docker Desktop
2. **"Port already in use"**: Kill processes using ports
3. **"Backend fails to start"**: Check MongoDB connection
4. **"Mobile can't connect"**: Use `http://localhost:3000` (not 127.0.0.1)

## Success Criteria

✅ All containers start without errors
✅ Backend API endpoints respond correctly
✅ Mobile app can submit analysis data
✅ Admin dashboard displays user data
✅ MongoDB contains proper collections
✅ Data flow: mobile → backend → mongo → admin
✅ Console logs show pipeline activity
✅ Docker compose up --build works end-to-end