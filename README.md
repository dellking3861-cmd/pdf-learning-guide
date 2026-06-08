# PDF Learning Guide Web App

An interactive learning platform that transforms PDFs into engaging educational content with AI-powered quizzes and real-time feedback.

## Features

- 📄 PDF upload and content extraction
- 🤖 AI-generated quiz questions with instant feedback
- 📊 Interactive progress tracking
- 🎯 Topic-based navigation
- 📱 Responsive UI design
- 🎬 Multimedia support

## Tech Stack

### Frontend
- React 18+
- Redux Toolkit (state management)
- TailwindCSS (styling)
- Axios (API calls)
- React Router (navigation)
- PDF.js (PDF rendering)

### Backend
- Node.js + Express
- MongoDB (database)
- Mongoose (ODM)
- JWT (authentication)
- Multer (file uploads)
- pdfparse (PDF extraction)
- OpenAI API (AI quiz generation)

### DevOps
- Docker & Docker Compose
- dotenv (environment variables)

## Project Structure

```
pdf-learning-guide/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── store/         # Redux store
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
├── server/                 # Node.js backend
│   ├── controllers/       # Route handlers
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── utils/             # Helper functions
│   ├── config/            # Configuration files
│   ├── app.js
│   └── server.js
├── docker-compose.yml     # Docker orchestration
├── .env.example           # Environment variables template
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 16+
- MongoDB 4.4+
- OpenAI API key

### Installation

1. Clone the repository
```bash
git clone https://github.com/dellking3861-cmd/pdf-learning-guide.git
cd pdf-learning-guide
```

2. Setup environment variables
```bash
cp .env.example .env
```

3. Install dependencies
```bash
# Frontend
cd client && npm install

# Backend
cd ../server && npm install
```

4. Start the application
```bash
# Using Docker Compose (recommended)
docker-compose up

# Or manually
# Terminal 1: Backend
cd server && npm start

# Terminal 2: Frontend
cd client && npm run dev
```

5. Access the app at `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### PDF Management
- `POST /api/pdf/upload` - Upload and extract PDF
- `GET /api/pdf/:id` - Get PDF content
- `DELETE /api/pdf/:id` - Delete PDF

### Learning Modules
- `GET /api/modules/:pdfId` - Get learning modules
- `GET /api/modules/:moduleId/content` - Get module content

### Quizzes
- `GET /api/quizzes/:moduleId` - Get quiz for module
- `POST /api/quizzes/:quizId/submit` - Submit quiz answers
- `GET /api/quizzes/:quizId/feedback` - Get instant feedback

### Progress Tracking
- `GET /api/progress/user/:userId` - Get user progress
- `PUT /api/progress/:progressId` - Update progress

## Environment Variables

```
MONGODB_URI=mongodb://localhost:27017/pdf-learning-guide
JWT_SECRET=your_jwt_secret_key
OPENAI_API_KEY=your_openai_api_key
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173
```

## Development

### Running Tests
```bash
# Frontend
cd client && npm test

# Backend
cd server && npm test
```

### Building for Production
```bash
# Frontend
cd client && npm run build

# Backend is production-ready as-is
```

## Contributing

1. Create a feature branch (`git checkout -b feature/AmazingFeature`)
2. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
3. Push to the branch (`git push origin feature/AmazingFeature`)
4. Open a Pull Request

## License

MIT License - see LICENSE file for details

## Support

For support, email support@pdflearningguide.com or open an issue on GitHub.
