# Fix for Signup/Login Issues

## ✅ API Endpoints Are Working!

The backend API is working correctly. The issue is likely with the frontend configuration or CORS.

## Quick Fix Steps

### 1. Rebuild Frontend Container

The frontend needs to be rebuilt to ensure it has the correct API URL:

```bash
# Stop containers
docker-compose down

# Rebuild frontend with correct API URL
docker-compose build frontend

# Start all services
docker-compose up -d
```

### 2. Verify API URL in Frontend

The frontend should be using `http://localhost:8085` as the API URL. Check the browser console (F12) for any errors.

### 3. Check Browser Console

1. Open http://localhost:3000
2. Press F12 to open Developer Tools
3. Go to Console tab
4. Try to signup/login
5. Check for any errors

Common errors:
- **CORS error**: Backend CORS config has been updated
- **Network error**: Check if backend is running on port 8085
- **404 error**: API URL might be wrong

### 4. Test API Directly

Run the test script to verify API is working:

```powershell
powershell -ExecutionPolicy Bypass -File test-api.ps1
```

### 5. Manual Browser Test

1. Open browser console (F12)
2. Run this in the console:

```javascript
// Test signup
fetch('http://localhost:8085/user/signup', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'test@test.com',
    password: 'test123',
    username: 'testuser',
    role: 'USER'
  })
})
.then(res => res.json())
.then(data => console.log('Signup:', data))
.catch(err => console.error('Error:', err));
```

## Common Issues and Solutions

### Issue 1: CORS Error

**Symptom**: Browser console shows CORS error

**Solution**: CORS config has been updated. Rebuild backend:

```bash
docker-compose build backend
docker-compose up -d backend
```

### Issue 2: Network Error / Connection Refused

**Symptom**: "Unable to connect to server" error

**Solution**: 
1. Check if backend is running: `docker ps`
2. Check backend logs: `docker logs music-backend`
3. Verify port 8085 is accessible: Open http://localhost:8085/user/1 in browser

### Issue 3: 404 Not Found

**Symptom**: 404 error when calling API

**Solution**: 
1. Check API URL in frontend code
2. Verify backend is running on correct port
3. Check if endpoint exists: `http://localhost:8085/user/signup`

### Issue 4: Frontend Not Using Correct API URL

**Symptom**: Frontend calls wrong URL

**Solution**: Rebuild frontend:

```bash
docker-compose build --no-cache frontend
docker-compose up -d frontend
```

## Verification Checklist

- [ ] Backend is running: `docker ps` shows `music-backend`
- [ ] Backend is healthy: `docker ps` shows `(healthy)`
- [ ] API is accessible: http://localhost:8085/user/1 returns user data
- [ ] Frontend is running: http://localhost:3000 loads
- [ ] Browser console has no errors
- [ ] CORS is configured correctly (updated in CorsConfig.java)

## Test Accounts

After successful signup, you can test login with:
- Email: `test@example.com`
- Password: `test123`

Or create a new account through the signup form.

## Still Having Issues?

1. Check backend logs: `docker logs music-backend --tail=100`
2. Check frontend logs: `docker logs music-frontend --tail=100`
3. Check browser console for detailed error messages
4. Verify database has users table: `docker exec music-mysql mysql -u root -pSaivarun@123 music -e "SELECT * FROM users;"`

