# 🗄️ Database Management Guide

This guide covers database operations, seeding, and maintenance for The Cosmic Coffeehouse project.

## 📋 Overview

The project uses MongoDB for data persistence with the following components:
- **Development Database**: Local MongoDB via Docker container
- **Test Database**: MongoDB Memory Server for isolated testing
- **Production Database**: MongoDB Atlas (future deployment)

## 🏗️ Database Structure

### Collections
- **users**: User accounts and authentication data
- **capsules**: Superpower coffee capsule products
- **machines**: Quantum brewing machine products
- **carts**: User shopping cart items (future)
- **orders**: Purchase history and transactions (future)

## 🚀 Quick Start

### Starting MongoDB

```bash
# Start MongoDB container (recommended)
npm run start:mongo

# Alternative: Docker direct command
docker run -d --name cosmic-mongo -p 27017:27017 mongo:latest

# Check container status
docker ps | grep cosmic-mongo
```

### Database Seeding

```bash
# Navigate to backend and seed database
cd backend && npm run seed

# Alternative: Run from project root
cd backend
npm run seed
```

## 📊 Sample Data Overview

The seeding script (`backend/src/scripts/seed.ts`) populates the database with:

### Superpower Capsules (4 items)
1. **Telepathic Blend Supreme**
   - Power Type: Mental
   - Rarity: Epic
   - Price: $299.99
   - Duration: 3 hours
   - Special: Mind reading & telepathic communication

2. **Hercules Roast**
   - Power Type: Physical
   - Rarity: Rare
   - Price: $189.99
   - Duration: 4 hours
   - Special: Super strength (50x human strength)

3. **Phantom Brew**
   - Power Type: Mystical
   - Rarity: Rare
   - Price: $279.99
   - Duration: 45 minutes
   - Special: Complete invisibility

4. **Enhanced Focus Blend**
   - Power Type: Mental
   - Rarity: Common
   - Price: $49.99
   - Duration: 6 hours
   - Special: Laser focus & concentration

### Quantum Brewing Machines (2 items)
1. **Quantum Brewmaster 3000**
   - Type: Quantum
   - Price: $12,999.99
   - Compatibility: Mental enhancement capsules
   - Special: Neural pathway optimization

2. **Universal Cosmic Brewer**
   - Type: Cosmic
   - Price: $4,999.99
   - Compatibility: All capsule types
   - Special: Multi-spectrum brewing

### Test Users (2 accounts)
1. **john@cosmic.com** / Password: `Test123!@#`
   - Username: cosmicjohn
   - Power Level: 25
   - Favorite Powers: Mental, Physical

2. **jane@quantum.com** / Password: `Test123!@#`
   - Username: quantumjane
   - Power Level: 45
   - Favorite Powers: Mystical, Temporal

## 🔧 Database Operations

### Complete Database Reset

```bash
# Stop all services
npm run stop

# Restart MongoDB
npm run stop:docker
npm run start:mongo

# Wait for MongoDB to initialize (3-5 seconds)
timeout 5

# Reseed database
cd backend && npm run seed
```

### Backup Operations

```bash
# Create backup
docker exec cosmic-mongo mongodump --db cosmic-coffeehouse --out /backup

# Copy backup to host
docker cp cosmic-mongo:/backup ./db-backup

# Restore from backup
docker exec -i cosmic-mongo mongorestore --db cosmic-coffeehouse /backup/cosmic-coffeehouse
```

### Data Verification

```bash
# Connect to MongoDB
docker exec -it cosmic-mongo mongosh

# Switch to database
use cosmic-coffeehouse

# Check collections
show collections

# Count documents
db.capsules.countDocuments()
db.machines.countDocuments()
db.users.countDocuments()

# View sample data
db.capsules.findOne()
db.users.findOne()
```

## 📝 Seeding Script Details

### Script Location
`backend/src/scripts/seed.ts`

### Process Flow
1. **Connect to Database**: Establishes MongoDB connection
2. **Clear Existing Data**: Removes all documents from collections
3. **Insert Capsules**: Adds 4 superpower capsule products
4. **Insert Machines**: Adds 2 quantum brewing machines
5. **Create Users**: Adds 2 test user accounts with hashed passwords
6. **Verify Success**: Confirms data insertion and logs results

### Key Features
- **Data Validation**: All data passes Mongoose schema validation
- **Password Hashing**: User passwords are automatically hashed with bcrypt
- **Error Handling**: Comprehensive error reporting and graceful failures
- **Cleanup**: Removes existing data before seeding to prevent duplicates
- **Logging**: Detailed console output for each step

## 🧪 Testing Database

### MongoDB Memory Server
For unit and integration tests, the project uses MongoDB Memory Server:

```bash
# Run backend tests with isolated database
cd backend
npm test

# Tests automatically start/stop in-memory MongoDB
# No manual database setup required for testing
```

### Test Data Management
- **Isolation**: Each test suite gets a fresh database instance
- **Cleanup**: Automatic teardown after test completion
- **Speed**: In-memory database provides fast test execution
- **Consistency**: Same data structure as production database

## 🔄 Environment Configuration

### Development Environment (.env)
```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/cosmic-coffeehouse
NODE_ENV=development

# Authentication
JWT_SECRET=your-cosmic-secret-key
JWT_EXPIRES_IN=15m
BCRYPT_ROUNDS=12
```

### Production Environment
```env
# Database Configuration (MongoDB Atlas)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cosmic-coffeehouse
NODE_ENV=production

# Security
JWT_SECRET=production-strength-secret-key
JWT_EXPIRES_IN=1h
BCRYPT_ROUNDS=12
```

## 🚨 Troubleshooting

### Common Issues

#### "MongoServerError: Authorization failed"
**Cause**: Incorrect MongoDB credentials or permissions
**Solution**:
```bash
# Reset Docker container
docker stop cosmic-mongo
docker rm cosmic-mongo
npm run start:mongo
```

#### "MongooseError: buffering timed out"
**Cause**: MongoDB connection timeout
**Solution**:
```bash
# Check MongoDB is running
docker ps | grep cosmic-mongo

# Restart if not running
npm run start:mongo

# Verify connection
docker exec cosmic-mongo mongosh --eval "db.adminCommand('ping')"
```

#### "Validation Error: Path `password` is required"
**Cause**: Missing required fields in user data
**Solution**: Check seed data structure matches User schema

#### "E11000 duplicate key error"
**Cause**: Attempting to insert duplicate unique field values
**Solution**:
```bash
# Clear database and reseed
cd backend && npm run seed
```

### Database Connection Issues

#### Check MongoDB Status
```bash
# Container status
docker ps -a | grep cosmic-mongo

# Container logs
docker logs cosmic-mongo

# Connection test
docker exec cosmic-mongo mongosh --eval "db.runCommand({ping:1})"
```

#### Reset Database Connection
```bash
# Complete reset process
npm run stop:docker
docker system prune -f
npm run start:mongo
cd backend && npm run seed
```

## 📊 Performance Considerations

### Indexing Strategy
```javascript
// Future indexing for performance
db.capsules.createIndex({ powerType: 1, rarity: 1 })
db.machines.createIndex({ type: 1, price: 1 })
db.users.createIndex({ email: 1 }, { unique: true })
```

### Query Optimization
- **Projection**: Only select needed fields
- **Pagination**: Limit results for large datasets
- **Aggregation**: Use MongoDB aggregation pipeline for complex queries

## 🔐 Security Best Practices

### Data Protection
- **Password Hashing**: All passwords use bcrypt with 12 rounds
- **Input Validation**: Mongoose schemas validate all input
- **Sanitization**: MongoDB naturally prevents SQL injection
- **Environment Variables**: Sensitive data stored in .env files

### Access Control
- **Development**: Local MongoDB without authentication
- **Production**: MongoDB Atlas with role-based access control
- **Testing**: Isolated in-memory databases

## 📈 Monitoring and Maintenance

### Health Checks
```bash
# API health endpoint
curl http://localhost:3000/health

# Database ping
curl http://localhost:3000/api

# Collection counts
docker exec cosmic-mongo mongosh cosmic-coffeehouse --eval "
  console.log('Capsules:', db.capsules.countDocuments());
  console.log('Machines:', db.machines.countDocuments());
  console.log('Users:', db.users.countDocuments());
"
```

### Regular Maintenance
- **Backup Schedule**: Daily backups for production
- **Log Monitoring**: Watch for slow queries and errors
- **Index Analysis**: Regular query performance review
- **Data Consistency**: Periodic validation of relationships

## 🔮 Future Enhancements

### Planned Features
- **Migration Scripts**: Version-controlled schema changes
- **Multi-Environment**: Staging and production database configurations
- **Monitoring**: Database performance metrics and alerting
- **Replication**: High availability with replica sets
- **Sharding**: Horizontal scaling for large datasets

---

**Database management made cosmic! ⚡**