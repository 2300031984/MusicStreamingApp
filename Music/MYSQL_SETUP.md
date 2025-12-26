# MySQL Database Setup for Music Application

This guide explains how the MySQL database is set up for login and signup functionality in both Docker and Kubernetes environments.

## Overview

The database initialization is handled automatically through SQL scripts in the `mysql-init/` directory. These scripts create the necessary tables for user authentication and playlist management.

## Database Schema

### Users Table
- `id` - Primary key (auto-increment)
- `email` - Unique email address for login
- `password` - User password (should be hashed in production)
- `username` - Display name
- `role` - User role (USER, ADMIN, etc.)
- `created_at` - Timestamp
- `updated_at` - Timestamp

### Playlists Table
- `id` - Primary key (auto-increment)
- `user_id` - Foreign key to users table
- `playlist_name` - Name of the playlist
- `song_name` - Song name
- `created_at` - Timestamp
- `updated_at` - Timestamp

### Playlist Songs Table
- `playlist_id` - Foreign key to playlists table
- `song_name` - Song name
- Composite primary key (playlist_id, song_name)

## Docker Setup

### How It Works

1. The `docker-compose.yml` mounts the `mysql-init/` directory to `/docker-entrypoint-initdb.d` in the MySQL container
2. MySQL automatically executes all `.sql` files in alphabetical order when the database is first initialized
3. Scripts run only on first database initialization

### Files

- `mysql-init/01-schema.sql` - Creates all database tables
- `mysql-init/02-sample-data.sql` - Optional test data (can be removed in production)

### Usage

```bash
# Start services (database will be initialized automatically)
docker-compose up -d

# Check if tables were created
docker exec -it music-mysql mysql -u root -pSaivarun@123 music -e "SHOW TABLES;"

# View users
docker exec -it music-mysql mysql -u root -pSaivarun@123 music -e "SELECT * FROM users;"
```

### Reset Database

To reset and re-run initialization scripts:

```bash
# Stop and remove everything including volumes
docker-compose down -v

# Start fresh
docker-compose up -d
```

## Kubernetes Setup

### How It Works

1. SQL scripts are stored in a ConfigMap (`k8s/mysql-init-configmap.yaml`)
2. The ConfigMap is mounted to `/docker-entrypoint-initdb.d` in the MySQL pod
3. MySQL executes the scripts on first initialization

### Files

- `k8s/mysql-init-configmap.yaml` - Contains the SQL scripts as ConfigMap data
- `k8s/mysql-deployment.yaml` - Mounts the ConfigMap to the MySQL container

### Usage

```bash
# Deploy (includes MySQL init ConfigMap)
cd k8s
kubectl apply -f mysql-init-configmap.yaml
kubectl apply -f mysql-deployment.yaml

# Check if tables were created
kubectl exec -it <mysql-pod> -n music-app -- mysql -u root -p$MYSQL_ROOT_PASSWORD music -e "SHOW TABLES;"

# View users
kubectl exec -it <mysql-pod> -n music-app -- mysql -u root -p$MYSQL_ROOT_PASSWORD music -e "SELECT * FROM users;"
```

### Reset Database

```bash
# Delete PVC (removes all data)
kubectl delete pvc mysql-pvc -n music-app

# Delete MySQL pod
kubectl delete pod -l app=mysql -n music-app

# New pod will recreate database and run init scripts
```

## Testing Login and Signup

### 1. Start the Application

**Docker:**
```bash
docker-compose up -d
```

**Kubernetes:**
```bash
cd k8s
kubectl apply -f .
```

### 2. Access the Frontend

- Docker: http://localhost:3000
- Kubernetes: Use port-forward or LoadBalancer IP

### 3. Test Signup

1. Click "SIGN UP" on the frontend
2. Enter:
   - Email: `test@example.com`
   - Username: `testuser`
   - Password: `test123`
3. Submit the form
4. You should be automatically logged in

### 4. Test Login

1. Logout (if logged in)
2. Click "LOGIN"
3. Enter the credentials you just created
4. You should be logged in successfully

### 5. Verify in Database

**Docker:**
```bash
docker exec -it music-mysql mysql -u root -pSaivarun@123 music -e "SELECT id, email, username, role FROM users;"
```

**Kubernetes:**
```bash
kubectl exec -it <mysql-pod> -n music-app -- mysql -u root -p$MYSQL_ROOT_PASSWORD music -e "SELECT id, email, username, role FROM users;"
```

## Sample Test Accounts

The `02-sample-data.sql` script creates test accounts (if enabled):

- **Admin**: `admin@music.com` / `admin123`
- **User**: `user@music.com` / `user123`

**Note:** These are plain text passwords for testing only. Remove this file or comment it out in production.

## Production Considerations

1. **Password Hashing**: 
   - The Spring Boot application should hash passwords using bcrypt or similar
   - Never store plain text passwords
   - Remove or disable `02-sample-data.sql` in production

2. **Database Security**:
   - Use strong passwords for database users
   - Limit database access to necessary services only
   - Use SSL/TLS for database connections in production

3. **Backup**:
   - Set up regular database backups
   - Test restore procedures

4. **Monitoring**:
   - Monitor database performance
   - Set up alerts for connection issues
   - Track user signup/login metrics

## Troubleshooting

### Tables Not Created

1. Check if MySQL container/pod started successfully
2. Check MySQL logs for errors
3. Verify init scripts are mounted correctly
4. Check if database already exists (scripts only run on first init)

### Cannot Connect to Database

1. Verify MySQL is running: `docker ps` or `kubectl get pods`
2. Check connection string in backend configuration
3. Verify network connectivity between backend and MySQL
4. Check database credentials

### Login/Signup Not Working

1. Check backend logs for errors
2. Verify database tables exist
3. Test database connection manually
4. Check CORS configuration
5. Verify API endpoints are accessible

## Additional Resources

- [MySQL Docker Image Documentation](https://hub.docker.com/_/mysql)
- [Spring Boot JPA Documentation](https://spring.io/guides/gs/accessing-data-jpa/)
- See `mysql-init/README.md` for more details on the initialization scripts

