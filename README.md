# To-Do Application

A full-stack To-Do application built with React.js, Node.js, and PostgreSQL, containerized with Docker. This application demonstrates modern web development practices with comprehensive testing, clean architecture, and responsive design.

## 🏗️ Architecture

- **Frontend**: React.js SPA with modern, responsive UI
- **Backend**: Node.js REST API with Express.js
- **Database**: PostgreSQL with optimized schema design
- **Containerization**: Docker Compose for orchestration
- **Testing**: Unit, integration, and E2E tests with high coverage

## ✨ Features

- ✅ Create new to-do tasks with title and description
- 📋 View the 5 most recent incomplete tasks
- ✅ Mark tasks as completed (Done button)
- 🎨 Clean, modern, responsive UI design
- 🧪 Comprehensive testing (unit, integration, e2e)
- 🔒 Input validation and error handling
- 📱 Mobile-responsive design
- 🚀 Docker containerization for easy deployment

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose installed
- Git (for cloning the repository)

### Installation & Running

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd COVERAGEX
   ```

2. **Start the application**
   ```bash
   docker-compose up --build
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - Database: localhost:5432

## 📚 API Documentation

### Endpoints

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| `GET` | `/api/tasks` | Get recent tasks | Query: `limit` (optional) | `{success: true, data: Task[]}` |
| `POST` | `/api/tasks` | Create new task | `{title: string, description?: string}` | `{success: true, data: Task}` |
| `PUT` | `/api/tasks/:id/complete` | Mark task as completed | None | `{success: true, data: Task}` |
| `GET` | `/health` | Health check | None | `{success: true, message: string}` |

### Request/Response Examples

**Create Task:**
```bash
curl -X POST http://localhost:3001/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Buy groceries", "description": "Get milk, bread, and eggs"}'
```

**Get Tasks:**
```bash
curl http://localhost:3001/api/tasks
```

**Complete Task:**
```bash
curl -X PUT http://localhost:3001/api/tasks/1/complete
```

## 🗄️ Database Schema

```sql
CREATE TABLE task (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Indexes:**
- `idx_task_created_at` on `created_at DESC` (for efficient ordering)
- `idx_task_completed` on `completed` (for filtering incomplete tasks)

## 🧪 Testing

### Test Coverage
- **Backend**: Unit tests for models, controllers, and API endpoints
- **Frontend**: Component tests with React Testing Library
- **E2E**: Full application testing with Cypress
- **Integration**: API integration tests

### Running Tests

```bash
# Individual component tests
docker-compose exec backend npm test
docker-compose exec frontend npm test
docker-compose exec frontend npm run test:e2e

# With coverage
docker-compose exec backend npm run test:coverage
docker-compose exec frontend npm test -- --coverage
```

### Test Structure
```
backend/src/tests/
├── task.test.js           # API endpoint tests
└── models/
    └── Task.test.js       # Model unit tests

frontend/src/
├── __tests__/
│   └── App.test.js        # App component tests
└── components/__tests__/
    ├── TaskForm.test.js   # Form component tests
    └── TaskList.test.js   # List component tests

cypress/e2e/
└── todo-app.cy.js         # E2E tests
```

## 🏛️ Architecture Principles

### Clean Code & SOLID Principles
- **Single Responsibility**: Each class/function has one reason to change
- **Open/Closed**: Open for extension, closed for modification
- **Liskov Substitution**: Derived classes are substitutable for base classes
- **Interface Segregation**: No client should depend on unused interfaces
- **Dependency Inversion**: Depend on abstractions, not concretions

### Design Patterns Used
- **Repository Pattern**: Task model abstracts database operations
- **MVC Pattern**: Clear separation of concerns
- **Dependency Injection**: Services injected into components
- **Error Handling**: Centralized error handling with proper HTTP status codes

## 🛠️ Development

### Project Structure
```
├── backend/                 # Node.js API
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Custom middleware
│   │   ├── models/         # Data models
│   │   ├── routes/         # API routes
│   │   ├── tests/          # Backend tests
│   │   └── server.js       # Application entry point
│   ├── Dockerfile
│   └── package.json
├── frontend/               # React.js SPA
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── services/       # API services
│   │   ├── __tests__/      # Frontend tests
│   │   └── App.js          # Main app component
│   ├── cypress/            # E2E tests
│   ├── Dockerfile
│   └── package.json
├── database/               # Database initialization
│   └── init.sql
├── scripts/                # Utility scripts
├── docker-compose.yml      # Container orchestration
└── README.md
```

### Environment Variables
```bash
# Backend
NODE_ENV=production
PORT=3001
DB_HOST=database
DB_PORT=5432
DB_NAME=tododb
DB_USER=todouser
DB_PASSWORD=todopass
FRONTEND_URL=http://localhost:3000

# Frontend
REACT_APP_API_URL=http://localhost:3001
```

## 🚀 Deployment

### Production Deployment
1. Set environment variables for production
2. Build and run with Docker Compose:
   ```bash
   docker-compose -f docker-compose.prod.yml up --build
   ```

### Scaling
- **Database**: Use connection pooling (already configured)
- **Backend**: Scale horizontally with load balancer
- **Frontend**: Serve through CDN for static assets

## 🔧 Troubleshooting

### Common Issues
1. **Port conflicts**: Ensure ports 3000, 3001, and 5432 are available
2. **Database connection**: Wait for database to be ready before starting backend
3. **CORS issues**: Check FRONTEND_URL environment variable
4. **Test failures**: Ensure all services are running before running tests

### Debug Commands
```bash
# Check service status
docker-compose ps

# View logs
docker-compose logs -f [service_name]

# Access container shell
docker-compose exec [service_name] sh

# Restart services
docker-compose restart
```

## 📈 Performance Considerations

- **Database**: Indexed queries for efficient task retrieval
- **API**: Connection pooling and request timeouts
- **Frontend**: Optimized bundle size and lazy loading
- **Caching**: HTTP caching headers for static assets

## 🔒 Security Features

- **Input Validation**: Server-side validation for all inputs
- **SQL Injection Prevention**: Parameterized queries
- **CORS Configuration**: Proper CORS setup
- **Security Headers**: Helmet.js for security headers
- **Error Handling**: No sensitive information in error messages

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
