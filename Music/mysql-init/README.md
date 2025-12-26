# MySQL Initialization Scripts

This directory contains SQL scripts that are automatically executed when MySQL container starts for the first time.

## How It Works

### Docker Compose
The `docker-compose.yml` mounts this directory to `/docker-entrypoint-initdb.d` in the MySQL container. MySQL automatically executes all `.sql` files in this directory in alphabetical order when the database is first initialized.

### Kubernetes
The SQL scripts are stored in a ConfigMap (`mysql-init-configmap.yaml`) and mounted to the same location in the MySQL pod.

## Scripts

### 01-schema.sql
Creates the database schema:
- `users` table - For user authentication (login/signup)
- `playlists` table - For storing user playlists
- `playlist_songs` table - Junction table for playlist songs

### 02-sample-data.sql
Optional sample data for testing:
- Test admin user: `admin@music.com` / `admin123`
- Test regular user: `user@music.com` / `user123`

**Note:** These passwords are plain text for testing only. In production, the Spring Boot application should hash passwords.

## Important Notes

1. **First Run Only**: These scripts only run when MySQL initializes a new database. If the database already exists (from a previous run), these scripts won't execute.

2. **Hibernate Auto-Update**: The Spring Boot application uses `spring.jpa.hibernate.ddl-auto=update`, which means Hibernate will automatically create/update tables. The SQL scripts here provide a backup and ensure tables exist even if Hibernate hasn't run yet.

3. **Password Hashing**: The sample data uses plain text passwords. In production:
   - Remove or comment out the sample data
   - Ensure your Spring Boot application uses password hashing (bcrypt, etc.)
   - Never commit real passwords to version control

## Resetting the Database

To reset the database and re-run initialization scripts:

### Docker Compose:
```bash
# Stop and remove containers and volumes
docker-compose down -v

# Start fresh
docker-compose up -d
```

### Kubernetes:
```bash
# Delete the PVC (this will delete all data)
kubectl delete pvc mysql-pvc -n music-app

# Delete the MySQL pod
kubectl delete pod -l app=mysql -n music-app

# The new pod will recreate the database and run init scripts
```

## Customization

You can add more SQL files to this directory (they'll be executed in alphabetical order):
- `03-custom-data.sql` - Additional data
- `04-indexes.sql` - Additional indexes
- etc.

## Testing Login/Signup

After the database is initialized:

1. **Signup**: Use the frontend at http://localhost:3000 to create a new account
2. **Login**: Use the credentials you created, or use the test accounts from `02-sample-data.sql`
3. **Verify**: Check the database:
   ```bash
   # Docker
   docker exec -it music-mysql mysql -u root -pSaivarun@123 music -e "SELECT * FROM users;"
   
   # Kubernetes
   kubectl exec -it <mysql-pod> -n music-app -- mysql -u root -p$MYSQL_ROOT_PASSWORD music -e "SELECT * FROM users;"
   ```

