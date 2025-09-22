# Assignment Management System - Backend

A Node.js/Express backend API for managing assignments between teachers and students. This system provides authentication, role-based access control, and full CRUD operations for assignments.

## 🚀 Features

- **User Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (Teacher/Student)
  - Password hashing with bcrypt
  - Protected routes with middleware

- **Assignment Management**
  - Create, read, update, delete assignments
  - Assignment status management (draft, published, completed)
  - Due date tracking
  - Teacher-specific assignment filtering

- **Student Submission System**
  - Submit assignment answers
  - View submission history
  - Deadline validation
  - Duplicate submission prevention

- **Database Integration**
  - MongoDB with Mongoose ODM
  - User and Assignment models
  - Population of related data
  - Indexed queries for performance

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **ODM**: Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **CORS**: cors
- **Logging**: morgan
- **Environment**: dotenv

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Raj-232/tailwebs-back-end.git
   cd tailwebs-back-end
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/assignment-system
   JWT_SECRET=your-super-secret-jwt-key
   NODE_ENV=development
   ```

4. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## 🗄️ Database Models

### User Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, min 6 chars),
  role: String (enum: ['teacher', 'student']),
  timestamps: true
}
```

### Assignment Model
```javascript
{
  title: String (required),
  description: String (required),
  dueDate: Date (required),
  status: String (enum: ['draft', 'published', 'completed']),
  teacher: ObjectId (ref: 'User'),
  submissions: [{
    student: ObjectId (ref: 'User'),
    answer: String (required),
    submittedAt: Date,
    reviewed: Boolean (default: false)
  }],
  timestamps: true
}
```

## 🔌 API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/register` | Register new user | Public |
| POST | `/login` | User login | Public |
| GET | `/me` | Get current user | Protected |

### Assignment Routes (`/api/assignments`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/` | Create assignment | Teacher |
| GET | `/teacher` | Get teacher's assignments | Teacher |
| GET | `/student` | Get published assignments | Student |
| GET | `/:id` | Get single assignment | Protected |
| PUT | `/:id` | Update assignment | Teacher |
| DELETE | `/:id` | Delete assignment | Teacher |
| POST | `/:id/submit` | Submit assignment | Student |
| GET | `/:id/submission` | Get student's submission | Student |

### Health Check
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Server health status |

## 📝 API Usage Examples

### User Registration
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "teacher"
  }'
```

### User Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Create Assignment (Teacher)
```bash
curl -X POST http://localhost:3000/api/assignments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Math Homework",
    "description": "Solve problems 1-10",
    "dueDate": "2024-01-15"
  }'
```

### Submit Assignment (Student)
```bash
curl -X POST http://localhost:3000/api/assignments/ASSIGNMENT_ID/submit \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "answer": "My solution to the assignment..."
  }'
```

## 🔒 Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

## 🛡️ Security Features

- Password hashing with bcrypt
- JWT token expiration (7 days)
- CORS configuration
- Input validation
- Role-based access control
- Protected route middleware

## 🚦 Error Handling

The API returns consistent error responses:

```json
{
  "message": "Error description",
  "error": "Detailed error message"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## 🧪 Testing

Test the API endpoints using tools like:
- Postman
- curl
- Thunder Client (VS Code extension)
- Insomnia

## 📁 Project Structure

```
tailwebs-back-end/
├── config/
│   └── db.js              # Database configuration
├── controllers/
│   ├── authController.js  # Authentication logic
│   └── assignmentController.js # Assignment logic
├── middlewares/
│   └── auth.js            # Authentication middleware
├── models/
│   ├── User.js            # User model
│   └── Assignment.js      # Assignment model
├── routes/
│   ├── auth.js            # Authentication routes
│   └── assignments.js     # Assignment routes
├── server.js              # Main server file
├── package.json           # Dependencies
└── README.md              # This file
```

## 🔧 Development

### Available Scripts

- `npm start` - Start the server in production mode
- `npm run dev` - Start the server in development mode with nodemon

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3000 |
| `MONGODB_URI` | MongoDB connection string | - |
| `JWT_SECRET` | JWT signing secret | - |
| `NODE_ENV` | Environment mode | development |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.