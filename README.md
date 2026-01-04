# 🚀 AI-Powered Collaborative Development Platform

A revolutionary real-time collaborative development platform that combines **AI-assisted coding**, **live collaboration**, **in-browser code execution**, and **instant messaging**. Built with cutting-edge technologies to enable teams to build, test, and deploy projects together in real-time.

---

## ✨ What is This Project?

This is an **AI-powered collaborative IDE** that brings together the best of multiple worlds:
- 💬 **Real-time Chat** - Communicate with your team instantly
- 🤖 **AI Code Assistant** - Get intelligent code suggestions and complete project scaffolding using Google's Gemini AI
- 👥 **Multi-user Collaboration** - Work together on projects with multiple collaborators
- 🌐 **In-Browser Execution** - Run and preview your code directly in the browser using WebContainer technology
- 📝 **Live Code Editor** - Edit files with syntax highlighting and see changes in real-time
- 🔐 **Secure Authentication** - JWT-based user authentication and authorization

---

## 🎯 Key Features

### 🤖 AI-Powered Development
- **Smart Code Generation**: Mention `@ai` in chat to get AI-generated code, file structures, and project scaffolding
- **Gemini Integration**: Powered by Google's Gemini 1.5 Flash model for intelligent code assistance
- **Automatic File Tree Creation**: AI generates complete project structures with proper dependencies
- **Best Practices**: AI follows MERN stack best practices with modular, maintainable code

### 👥 Real-Time Collaboration
- **Live Chat**: WebSocket-powered instant messaging within projects
- **Multi-user Support**: Add collaborators to projects and work together
- **Real-time Sync**: See changes as they happen across all connected users
- **User Management**: Easy collaborator addition and management

### 💻 In-Browser Development Environment
- **WebContainer Technology**: Run Node.js applications directly in the browser
- **Live Preview**: Instant preview of your running application
- **Code Editor**: Syntax-highlighted code editing with live updates
- **File Explorer**: Navigate and manage project files easily
- **NPM Support**: Install and run npm packages in the browser

### 🔐 Security & Authentication
- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt-based password encryption
- **Protected Routes**: Middleware-based route protection
- **Session Management**: Cookie-based session handling

### 📊 Project Management
- **Project Creation**: Create and manage multiple projects
- **File Tree Persistence**: Projects are saved with their complete file structure
- **Collaborator Management**: Add/remove team members from projects
- **Project Dashboard**: View all your projects and collaborators at a glance

---

## 📁 Folder Structure

```
AI Chat App/
│
├── 📂 backend/                      # Backend server (Node.js + Express)
│   ├── 📂 controllers/              # Request handlers
│   │   ├── ai.controller.js         # AI-related endpoints
│   │   ├── project.controller.js    # Project management
│   │   └── user.controller.js       # User authentication
│   │
│   ├── 📂 db/                       # Database configuration
│   │   └── db.js                    # MongoDB connection setup
│   │
│   ├── 📂 middleware/               # Express middleware
│   │   └── auth.middleware.js       # JWT authentication middleware
│   │
│   ├── 📂 models/                   # Mongoose schemas
│   │   ├── project.model.js         # Project schema (name, users, fileTree)
│   │   └── user.model.js            # User schema (email, password)
│   │
│   ├── 📂 routes/                   # API route definitions
│   │   ├── ai.routes.js             # AI generation endpoints
│   │   ├── project.routes.js        # Project CRUD operations
│   │   └── user.routes.js           # User auth routes
│   │
│   ├── 📂 services/                 # Business logic
│   │   ├── ai.service.js            # Gemini AI integration
│   │   ├── project.service.js       # Project operations
│   │   ├── redis.service.js         # Redis client setup
│   │   └── user.service.js          # User operations
│   │
│   ├── app.js                       # Express app configuration
│   ├── server.js                    # Server entry point + Socket.io setup
│   ├── package.json                 # Backend dependencies
│   └── .env                         # Environment variables
│
├── 📂 frontend/                     # Frontend application (React + Vite)
│   ├── 📂 public/                   # Static assets
│   │
│   ├── 📂 src/                      # Source code
│   │   ├── 📂 assets/               # Images, fonts, etc.
│   │   │
│   │   ├── 📂 auth/                 # Authentication components
│   │   │   └── UserAuth.jsx         # Auth wrapper component
│   │   │
│   │   ├── 📂 config/               # Configuration files
│   │   │   ├── axios.js             # Axios instance with interceptors
│   │   │   ├── socket.js            # Socket.io client setup
│   │   │   └── webContainer.js      # WebContainer initialization
│   │   │
│   │   ├── 📂 context/              # React Context
│   │   │   └── user.context.jsx     # User state management
│   │   │
│   │   ├── 📂 routes/               # Route configuration
│   │   │   └── AppRoutes.jsx        # Application routing
│   │   │
│   │   ├── 📂 screens/              # Page components
│   │   │   ├── Home.jsx             # Project dashboard
│   │   │   ├── Login.jsx            # Login page
│   │   │   ├── Register.jsx         # Registration page
│   │   │   └── Project.jsx          # Main IDE workspace
│   │   │
│   │   ├── App.jsx                  # Root component
│   │   ├── main.jsx                 # Application entry point
│   │   └── index.css                # Global styles
│   │
│   ├── index.html                   # HTML template
│   ├── package.json                 # Frontend dependencies
│   ├── vite.config.js               # Vite configuration
│   ├── tailwind.config.js           # Tailwind CSS config
│   └── eslint.config.js             # ESLint configuration
│
├── .gitignore                       # Git ignore rules
└── README.md                        # This file
```

---

## 🛠️ Tech Stack

### Frontend
- **⚛️ React 18** - Modern UI library
- **⚡ Vite** - Lightning-fast build tool
- **🎨 Tailwind CSS** - Utility-first CSS framework
- **🔌 Socket.io Client** - Real-time WebSocket communication
- **📡 Axios** - HTTP client for API requests
- **🌐 WebContainer API** - In-browser Node.js runtime
- **📝 Markdown-to-JSX** - Markdown rendering
- **💡 Highlight.js** - Syntax highlighting
- **🧭 React Router DOM** - Client-side routing
- **🎭 Remixicon** - Icon library

### Backend
- **🟢 Node.js** - JavaScript runtime
- **🚂 Express.js** - Web application framework
- **🔌 Socket.io** - Real-time bidirectional communication
- **🍃 MongoDB + Mongoose** - NoSQL database and ODM
- **🔐 JWT** - JSON Web Tokens for authentication
- **🔒 Bcrypt** - Password hashing
- **🤖 Google Generative AI** - Gemini AI integration
- **🔴 Redis (ioredis)** - Caching and session storage
- **✅ Express Validator** - Input validation
- **🍪 Cookie Parser** - Cookie handling
- **🌐 CORS** - Cross-origin resource sharing
- **📊 Morgan** - HTTP request logger

### Development Tools
- **📝 ESLint** - Code linting
- **🔄 Nodemon** - Auto-restart on changes
- **🌍 dotenv** - Environment variable management

---

## 📦 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Redis (optional, for caching)
- Google AI API Key (for Gemini)

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/Mohhit6075/Chat-App.git
cd "AI Chat App"
```

### 2️⃣ Backend Setup

#### Install Dependencies
```bash
cd backend
npm install
```

#### Configure Environment Variables
Create a `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=3000

# Database
MONGODB_URI=mongodb://localhost:27017/ai-chat-app
# Or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ai-chat-app

# JWT Secret (use a strong random string)
JWT_SECRET=your_super_secret_jwt_key_here

# Google AI (Gemini)
GOOGLE_AI_KEY=your_google_gemini_api_key_here

# Redis (Optional)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
```

#### Start the Backend Server
```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

The backend server will start on `http://localhost:3000`

### 3️⃣ Frontend Setup

#### Install Dependencies
```bash
cd frontend
npm install
```

#### Configure API Endpoint
Update `frontend/src/config/axios.js` if your backend runs on a different port:

```javascript
const instance = axios.create({
    baseURL: 'http://localhost:3000', // Update if needed
    // ...
});
```

#### Start the Frontend Development Server
```bash
npm run dev
```

The frontend will start on `http://localhost:5173` (or another port if 5173 is busy)

### 4️⃣ Access the Application
Open your browser and navigate to:
```
http://localhost:5173
```

---

## 🎮 How to Use

### 1. **Register & Login**
- Create a new account with your email and password
- Login to access the dashboard

### 2. **Create a Project**
- Click "New Project" on the home screen
- Enter a unique project name
- Your project is created and ready to use

### 3. **Add Collaborators**
- Open a project
- Click "Add collaborator" button
- Select users from the list
- They can now access and work on the project

### 4. **Use AI Code Generation**
- In the project chat, type `@ai` followed by your request
- Example: `@ai create an express server with MongoDB connection`
- The AI will generate the complete code structure
- Files will automatically appear in the file explorer

### 5. **Edit Code**
- Click on any file in the file explorer
- Edit the code directly in the syntax-highlighted editor
- Changes are automatically saved

### 6. **Run Your Code**
- Click the "Run" button
- The application will install dependencies and start your project
- View the live preview in the iframe panel

### 7. **Collaborate in Real-Time**
- Chat with team members in the project
- See file changes as they happen
- Work together seamlessly

---

## 🔌 API Endpoints

### Authentication
- `POST /users/register` - Register a new user
- `POST /users/login` - Login user
- `GET /users/profile` - Get user profile (protected)
- `GET /users/logout` - Logout user
- `GET /users/all` - Get all users (protected)

### Projects
- `POST /projects/create` - Create a new project (protected)
- `GET /projects/all` - Get all user projects (protected)
- `GET /projects/get-project/:projectId` - Get project by ID (protected)
- `PUT /projects/add-user` - Add collaborators to project (protected)
- `PUT /projects/update-file-tree` - Update project file structure (protected)

### AI
- `POST /ai/generate` - Generate code using AI (protected)

### WebSocket Events
- `project-message` - Send/receive messages in project
- `connect` - Client connection
- `disconnect` - Client disconnection

---

## 🌟 Advanced Features

### WebContainer Integration
The platform uses WebContainer API to run Node.js applications directly in the browser:
- No server-side execution needed for user code
- Secure sandboxed environment
- Full npm package support
- Real-time preview

### AI System Prompt
The AI is configured with a specialized system prompt that:
- Follows MERN stack best practices
- Creates modular, maintainable code
- Handles edge cases and errors
- Generates proper file structures
- Includes helpful comments

---


## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👨‍💻 Author

**Mohit**
- GitHub: [@Mohhit1230](https://github.com/Mohhit1230)

---

## 🚀 Future Enhancements

- [ ] Video/Voice chat integration
- [ ] Code review and commenting system
- [ ] Version control integration (Git)
- [ ] Multiple programming language support
- [ ] Advanced code completion
- [ ] Deployment integration
- [ ] Team analytics and insights
- [ ] Mobile app version

---

