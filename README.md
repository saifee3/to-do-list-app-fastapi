# TodoList App using FastAPI
<img src="https://github.com/user-attachments/assets/aadcedc2-7571-4244-8d82-8c3de62565f9" alt="Custom Icon" width="1050" height="400">

![GitHub Language Count](https://img.shields.io/github/languages/count/saifee3/todosphere?style=flat-square&color=green)
![GitHub License](https://img.shields.io/github/license/saifee3/todosphere?style=flat-square&color=orange)
![Python Version](https://img.shields.io/badge/python-3.8%2B-blue?style=flat-square)
![FastAPI Version](https://img.shields.io/badge/fastapi-0.100.0%2B-blue?style=flat-square)
![Neon](https://img.shields.io/badge/Neon-00F793?style=flat-square&logo=databricks&logoColor=white)


## Project Overview

Welcome to **ToDoKit**, a modern, intuitive task management application designed to help you organize your life and achieve more. With its clean, responsive interface and robust backend, app provides a seamless experience for managing your daily tasks across all your devices. App combines a powerful FastAPI backend to deliver a fast, reliable, and user-friendly experience.

- **User Authentication**: Secure sign-up and login system with JWT authentication
- **Task Management**: Create, read, update, and delete tasks with rich text support
- **Responsive Design**: Works seamlessly across desktops, tablets, and mobile devices
- **Real-time Updates**: Instant feedback on task operations
- **Data Persistence**: All tasks are securely stored in a PostgreSQL Neon database

## Screenshots
<div align="center">   <img src="https://github.com/user-attachments/assets/0dac5dc1-3cf3-4ec8-badb-608d3c565eb1" alt="Custom Icon" width="1000" height="700">  </div>
<div align="center">   <img src="https://github.com/user-attachments/assets/784f8141-5cf3-44e0-a86a-8285a7df7f9e" alt="Custom Icon" width="1000" height="700">  </div>
<div align="center">   <img src="https://github.com/user-attachments/assets/fab4bc9e-15a2-4d41-819c-ded3cc28d81e" alt="Custom Icon" width="1000" height="700">  </div>
<div align="center">   <img src="https://github.com/user-attachments/assets/4a862333-e832-47c3-a592-14dc4541ac20" alt="Custom Icon" width="1000" height="700">  </div>

## Technology Stack

### Backend

- **Framework**: FastAPI - A modern, fast (high-performance) web framework for building APIs with Python
- **Database**: PostgreSQL Neon - A managed, serverless PostgreSQL database with automatic scaling
- **ORM**: SQLAlchemy - The SQL toolkit and ORM for Python
- **Authentication**: JWT (JSON Web Tokens) - Secure stateless authentication
- **Password Hashing**: Passlib with bcrypt - Secure password storage
- **API Documentation**: Automatic Swagger UI and Redoc documentation
- **CORS**: Cross-Origin Resource Sharing middleware for frontend communication
- **Error Handling**: Comprehensive error handling and validation

### Frontend

- **HTML5**: Semantic markup for structured content
- **CSS3**: Styling with CSS
- **JavaScript**: JS with Fetch API for backend communication
- **Responsive Design**: Mobile-first approach with media queries

## Project Structure

```
todo-sphere/
├── backend/                # Backend directory
│   ├── main.py             # Main FastAPI application file
│   ├── database.py         # Database configuration
│   ├── models.py           # Database models
│   ├── routes/             # API routes
│   │   ├── __init__.py
│   │   ├── user.py        # User authentication routes
│   │   └── task.py        # Task management routes
│   └── requirements.txt   # Backend dependencies
│
├── frontend/               # Frontend directory
│   ├── css/               # CSS stylesheets
│   ├── images/            # Image assets
│   ├── js/                # JavaScript files
│   ├── home.html          # Home page
│   ├── index.html         # Landing page
│   ├── login.html         # Login page
│   └── signup.html        # Signup page
│
├── .gitignore              # Files to ignore in version control
├── LICENSE                 # Project license
└── README.md               # This documentation file
```

## Getting Started

### Prerequisites

- Python 3.8 or higher
- Git
- PostgreSQL Neon account

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/todosphere.git
   cd todosphere
   ```

2. **Create a Virtual Environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install Backend Dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

4. **Run Development Server**
   ```bash
   # In one terminal, run the backend
   uvicorn backend.main:app --reload
   
   # In another terminal, serve the frontend
   cd frontend
   python -m http.server 8000
   ```


## NeonDB Setup

TodoList App uses NeonDB, a managed PostgreSQL database service. The database connection string is configured in the `backend/database.py` file:

```python
SQLALCHEMY_DATABASE_URL = (
    "postgresql://TODOdb_owner:npg_0lrtXiz3kBOL@ep-shiny-bird-a5kiwx6l-pooler.us-east-2.aws.neon.tech/TODOdb?sslmode=require"
)
```

### Steps to Replicate this Setup

1. **Create a Neon Account**
   - Go to [NeonDB website](https://neon.tech/) and sign up for an account
   - Complete the registration process

2. **Create a New Project**
   - Log in to your Neon dashboard
   - Click on "New Project"
   - Give your project a name (e.g., "TodoList")
   - Select your preferred region
   - Click "Create Project"

3. **Create a New Branch**
   - In your project dashboard, click on "New Branch"
   - Keep the default branch name or choose your own
   - Click "Create Branch"

4. **Connect to Your Database**
   - After creating the branch, you'll see connection information
   - Copy the connection string (it will look something like this):
     ```
     postgresql://TODOdb_owner:npg_0lrtXiz3kBOL@ep-shiny-bird-a5kiwx6l-pooler.us-east-2.aws.neon.tech/TODOdb?sslmode=require
     ```
   - Update the `SQLALCHEMY_DATABASE_URL` in your `backend/database.py` file with this connection string

5. **Database Credentials**
   - The connection string includes your database username and password
   - Store these securely and do not commit them to version control
   - Consider using environment variables or a secrets manager for production deployments
  
     
## API Documentation

## Base URL

The API is available at `http://localhost:8000/api` during local development. For production deployments, replace `localhost:8000` with your server domain or IP address.

## Authentication

App uses JWT (JSON Web Tokens) for authentication. You need to obtain a token by logging in and include it in the `Authorization` header of subsequent requests.

### Login

```http
POST /login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "your-password"
}
```

**Response:**
```json
{
  "access_token": "your-jwt-token",
  "token_type": "bearer"
}
```

### Signup

```http
POST /signup
```

**Request Body:**
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "date_of_birth": "1990-01-01",
  "gender": "Male",
  "email": "john.doe@example.com",
  "password": "secure-password"
}
```

**Response:**
```json
{
  "message": "User created",
  "user_id": 1
}
```

## Task Management

### Create Task

```http
POST /tasks
```

**Headers:**
```
Authorization: Bearer your-jwt-token
```

**Request Body:**
```json
{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "completed": false
}
```

**Response:**
```json
{
  "message": "Task created",
  "task": {
    "id": 1,
    "title": "Buy groceries",
    "description": "Milk, eggs, bread",
    "completed": false
  }
}
```

### Get All Tasks

```http
GET /tasks
```

**Headers:**
```
Authorization: Bearer your-jwt-token
```

**Response:**
```json
[
  {
    "id": 1,
    "title": "Buy groceries",
    "description": "Milk, eggs, bread",
    "completed": false,
    "created_at": "2023-07-20T12:00:00",
    "updated_at": "2023-07-20T12:00:00"
  }
]
```

### Update Task

```http
PATCH /tasks/{task_id}
```

**Headers:**
```
Authorization: Bearer your-jwt-token
```

**Request Body:**
```json
{
  "title": "Updated title",
  "description": "Updated description",
  "completed": true
}
```

**Response:**
```json
{
  "message": "Task partially updated",
  "task": {
    "id": 1,
    "title": "Updated title",
    "description": "Updated description",
    "completed": true
  }
}
```

### Delete Task

```http
DELETE /tasks/{task_id}
```

**Headers:**
```
Authorization: Bearer your-jwt-token
```

**Response:**
```json
{
  "message": "Task deleted"
}
```

## Error Handling

The API returns standard HTTP status codes with appropriate error messages.

### Common Error Responses

| Status Code | Description                     | Example Response                          |
|-------------|---------------------------------|-------------------------------------------|
| 400         | Bad Request                     | {"detail": "Invalid request data"}        |
| 401         | Unauthorized                    | {"detail": "Invalid credentials"}         |
| 403         | Forbidden                       | {"detail": "Permission denied"}           |
| 404         | Not Found                       | {"detail": "Task not found"}              |
| 500         | Internal Server Error           | {"detail": "An unexpected error occurred"}|

## Security

- All API endpoints require authentication except for `/login` and `/signup`
- JWT tokens should be stored securely on the client side
- Passwords are hashed using bcrypt before storage
- The API uses HTTPS in production environments
- Rate limiting is implemented to prevent brute force attacks


## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Credits

- **[FastAPI](https://fastapi.tiangolo.com/)** - The high-performance web framework used to build this API.
- **[SQLAlchemy](https://www.sqlalchemy.org/)** - The SQL toolkit and ORM used for database interactions.
- **[PostgreSQL Neon](https://neon.tech/)** - The Neon PostgreSQL database.
- Banner Image by **Real Python** on https://realpython.com/fastapi-python-web-apis/





